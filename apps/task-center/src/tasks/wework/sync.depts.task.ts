import { Injectable, Inject, Logger } from "@nestjs/common";
import { WeworkAPI } from "./api/wework.api";
import { IGroupService } from "libs/api/infra-api/src";
import * as _ from 'lodash';
import { ITask } from "../task";

@Injectable()
export class SyncDeptsTask implements ITask {
  constructor(
    @Inject('IGroupService') private readonly groupService: IGroupService,
  ) {}

  async run(args: Record<string, any>) {
    // TODO 校验参数
    const tenant = args.tenant;
    const corpId = args.corp_id || 'ww524646b7889b370b';
    const secret = args.secret || 'xCE0HCiK0QeITkBuEWzxw5sajlrWXDYOdMQm5kKeN10';

    const weworkAPI = new WeworkAPI(corpId, secret);  
    const token = await weworkAPI.fetchToken();
    console.log('获取到access_token: ', token);

    const resp = await weworkAPI.fetchDeps(token.access_token);
    console.log('depts resp: ', resp);
    
    if (resp.errcode != 0) {
      Logger.error(`同步企业微信通讯录出错: code: ${resp.errcode}, msg: ${resp.errmsg}`);
      // TODO
      return;
    }

    const groups = [];
    const depts = resp.department;
    Logger.error(`总共需要同步部门数量: ${depts.length}`);

    let updateCount = 0;
    let createCount = 0;
    let errorCount = 0;

    // 先 创建/更新
    for (const dept of depts) {
      const group_id = `wework:${dept.id}`;
      const existingGroup = await this.groupService.findByOuterId({ tenant }, 'wework', dept.id.toString());
      if (existingGroup) {
        try {
          const updatedGroup = await this.groupService.update({ tenant }, {
            id: existingGroup.id,
            name: dept.name,
            type: 'wework',
            group_id,
            outer_id: dept.id.toString(),
          });
  
          groups.push(updatedGroup);
          updateCount++;
        } catch(e) {
          console.error(e);

          errorCount++;
        }
      } else {
        try {
          const newGroup = await this.groupService.create({ tenant }, {
            name: dept.name,
            type: 'wework',
            outer_id: dept.id.toString(),
            group_id,
          });
  
          groups.push(newGroup);
          createCount++;
        } catch(e) {
          console.error(e);
          errorCount++;
        }
      }
    }

    Logger.log(`更新数量: ${updateCount}, 创建数量: ${createCount}, 失败数量: ${errorCount}`);

    // 再更新关系
    updateCount = 0;

    const id2dept = _.keyBy(depts, 'id');
    const outer_id2group = _.keyBy(groups, 'outer_id');
    console.log('outer_id2group: ', outer_id2group);

    for (const dept of resp.department) {
      const parentDept = id2dept[dept.parentid]
      let parantGroupId: string;
      if (parentDept) {
        const parentGroup = outer_id2group[parentDept.id];
        parantGroupId = parentGroup.id;
      }
      const group = outer_id2group[dept.id];

      await this.groupService.update({ tenant }, {
        id: group.id,
        parent_id: parantGroupId,
      });

      updateCount++;
    }
    console.log('groups: ', groups);

    Logger.log(`更新组织关系 数量: ${updateCount}`);

    Logger.log(`同步成功, 数量 ${groups.length}`);
  }
}



