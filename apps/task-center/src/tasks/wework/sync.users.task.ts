import { Injectable, Inject, Logger } from "@nestjs/common";
import { WeworkAPI } from "./api/wework.api";
import * as _ from 'lodash';
import { 
  IGroupService,
  IUserService,
  IConnectionService,
  UpdateUserModel,
  ConnectionModel,
  IIdentityService,
} from "libs/api/infra-api/src";
import { plainToClass } from "class-transformer";
import { ITask } from "../task";
import { 
  IdentityModel, 
  ProfileDataModel,
  GroupModel,
} from "libs/api/infra-api/src";

@Injectable()
export class SyncUsersTask implements ITask {
  constructor(
    @Inject('IGroupService') private readonly groupService: IGroupService,
    @Inject('IConnectionService') private readonly connectionService: IConnectionService,
    @Inject('IUserService') private readonly userService: IUserService,
    @Inject('IIdentityService') private readonly identityService: IIdentityService,
  ) {}

  async run(args: Record<string, any>) {
    // TODO 校验参数
    const tenant = args.tenant;
    const connectionName = args.connection || 'wework:qrcode';
    const connection = await this.connectionService.findByName({ tenant }, connectionName);

    const { corp_id = 'ww524646b7889b370b', corp_secret = 'xCE0HCiK0QeITkBuEWzxw5sajlrWXDYOdMQm5kKeN10' } = connection.options;

    const weworkAPI = new WeworkAPI(corp_id, corp_secret);
    const token = await weworkAPI.fetchToken();
    console.log('access_token: ', token);

    const result = await this.groupService.paginate({ tenant }, { per_page: 1, type: 'wework', parent_id: '' });
    Logger.log(`Need Sync ${result.meta.total} groups`);
    const per_page = 100;
    const pages = (result.meta.total / per_page) + 1;
    let current = 1;
    
    const ctx = {
      createCount: 0,
      updateCount: 0,
      errorCount: 0,
      connection, tenant, weworkAPI, token,
    };
    
    while (current <= pages) {
      const result = await this.groupService.paginate({ tenant }, { page: current, per_page, type: 'wework' });
      for (const group of result.items) {
        await this.syncDeptusers(ctx, group);
      }

      current++;
    }

    Logger.log(`更新数量: ${ctx.updateCount}, 创建数量: ${ctx.createCount}, 失败数量: ${ctx.errorCount}`);
  }

  async syncDeptusers(ctx: Record<string, any>, group: GroupModel) {
    const weworkAPI = ctx.weworkAPI as WeworkAPI;
    const connection = ctx.connection as ConnectionModel;

    const resp = await weworkAPI.fetchUserList(ctx.token.access_token, group.outer_id);
    console.log('depts resp: ', resp.userlist);

    if (resp.errcode != 0) {
      Logger.error(`同步企业微信通讯录出错: code: ${resp.errcode}, msg: ${resp.errmsg}`);
      // TODO
      return;
    }

    for (const user of resp.userlist) {
      const { gender, avatar, name, mobile, biz_mail, ...profile } = user;
      const userid = `${connection.options.corp_id}|${user.userid}`;

      const identity: Partial<IdentityModel> = {
        user_id: userid,
        access_token: ctx.token.access_token,
        provider: connection.strategy,
        is_social: true,
        profile_data: plainToClass(ProfileDataModel, {
          picture: avatar,
          nickname: name,
          name,
          phone_number: mobile,
          email: biz_mail,
          gender: parseInt(gender),
          ...profile,
        }),
        connection: connection.name,
      };

      try {
        let federactedUser = await this.userService.findByConnection({ tenant: ctx.tenant }, connection.name, userid);
        if (!federactedUser) {
          federactedUser = await this.userService.create(ctx, {
            user_id: identity.provider + ':' + identity.user_id,
            connection: identity.connection,
            name: identity.profile_data.name,
            nickname: identity.profile_data.name,
            phone_number: identity.profile_data.phone_number,
            email: identity.profile_data.email,
            picture: identity.profile_data.picture,
            gender: identity.profile_data.gender,
            identities: [identity as any],
          });
          Logger.log(`Create new user, from ${userid} ${user.name}, to: ${federactedUser.user_id}`);
          ctx.createCount++;
        } else {
          const targetIdentity: Partial<IdentityModel> = federactedUser.identities.filter(
            (it) =>
              identity.user_id == it.user_id &&
              identity.connection == it.connection,
          )[0];

          federactedUser = await this.userService.update(ctx, federactedUser.user_id, {
            name: identity.profile_data.name,
            nickname: identity.profile_data.nickname,
            phone_number: identity.profile_data.phone_number,
            email: identity.profile_data.email,
            picture: identity.profile_data.picture,
            gender: identity.profile_data.gender,
          } as Partial<UpdateUserModel>);

          await this.identityService.update(ctx, targetIdentity.id, identity);

          Logger.log(`Update user, from: ${userid}, ${user.name}, to: ${federactedUser.user_id}`);
          ctx.updateCount++;
        }

        // 更新部门
        const groups: string[] = [];
        for (const outerId of user.department) {
          const group = await this.groupService.findByOuterId(ctx, 'wework', outerId.toString());
          if (group) {
            groups.push(group.id);
          }
        }
        // console.log('fuck federactedUser: ', federactedUser);

        await this.userService.updateGroupsToUser(ctx, federactedUser.user_id, groups, true);
      } catch(e) {
        console.error(e);
        ctx.errorCount++;
      }
    }
  }
}



