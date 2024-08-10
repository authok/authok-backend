import { Injectable, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IContext } from '@libs/nest-core';
import {
  PostPermissions,
  IUserService,
  PostUserRoleModel,
  PermissionModel,
  IdentityModel,
  CreateUserModel, 
  UpdateUserModel, 
  UserModel,
  LinkIdentityReq,
  OrganizationModel,
  UserRoleModel,
} from 'libs/api/infra-api/src';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class RestfulUserService implements IUserService {
  private serviceBaseUrl: string;

  constructor(
    private configService: ConfigService,
    private promisifyHttp: PromisifyHttpService,
  ) {
    this.serviceBaseUrl = this.configService.get<string>('services.baseUrl');
  }

  async create(
    ctx: IContext,
    user: CreateUserModel,
  ): Promise<UserModel | null> {
    return await this.promisifyHttp.post(`${this.serviceBaseUrl}/users`, user, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async createByFederatedIdentity(
    ctx: IContext,
    identity: Partial<IdentityModel>,
  ): Promise<UserModel> {
    return await this.promisifyHttp.post(`${this.serviceBaseUrl}/users/createByFederatedIdentity`, identity, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async retrieve(
    ctx: IContext,
    user_id: string,
  ): Promise<UserModel | undefined> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/users/${user_id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async findByGuid(
    ctx: IContext,
    guid: string,
  ): Promise<UserModel | undefined> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/users/findByGuid/${guid}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async userVerifiedEmail(ctx: IContext, user_id: string) {
    return await this.promisifyHttp.post(
      `${this.serviceBaseUrl}/users/${user_id}/email_verified`,
      null,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async validateUser(
    ctx: IContext,
    user: UserModel,
    password: string,
  ) {
    // TODO
    return undefined;
  }

  async enable2fa(ctx: IContext, user_id: string): Promise<void> {
    return await this.promisifyHttp.post(
      `${this.serviceBaseUrl}/users/${user_id}/enable2fa`,
      null,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async disable2fa(ctx: IContext, user_id: string): Promise<void> {
    return await this.promisifyHttp.post(
      `${this.serviceBaseUrl}/users/${user_id}/disable2fa`,
      null,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async findByEmail(
    ctx: IContext,
    email: string,
  ): Promise<UserModel | undefined> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/users/findByEmail`,
      {
        params: {
          tenant: ctx.tenant,
          email,
        },
      },
    );
  }

  async findByPhoneNumber(
    ctx: IContext,
    phone_number: string,
  ): Promise<UserModel | undefined> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/users/findByPhoneNumber`,
      {
        params: {
          phone_number,
        },
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async findByName(
    ctx: IContext,
    username: string,
  ): Promise<UserModel | undefined> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/users/findByName`,
      {
        params: {
          username,
        },
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async update(
    ctx: IContext,
    id: string,
    data: Partial<UpdateUserModel>,
  ): Promise<UserModel> {
    return await this.promisifyHttp.patch(
      `${this.serviceBaseUrl}/users/${id}`,
      data,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async delete(ctx: IContext, user_id: string): Promise<void> {
    return await this.promisifyHttp.delete(
      `${this.serviceBaseUrl}/users/${user_id}`,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<UserModel>> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/users/`, {
      params: query,
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  findByConnection(
    ctx: IContext,
    connection: string,
    user_id: string,
  ): Promise<UserModel | undefined> {
    // TODO
    return null;
  }

  async updateFederatedIdentity(ctx: IContext, identity: IdentityModel) {
    // TODO
    return null;
  }

  async addFederatedIdentity(ctx: IContext, user_id: string, identity: IdentityModel) {
    // TODO
    return null;
  }

  async removeFederatedIdentity(ctx: IContext, user_id: string, provider: string) {
    // TODO
    return null;
  }

  async assignPermissions(
    ctx: IContext,
    user_id: string,
    body: PostPermissions,
  ): Promise<void> {
    return this.promisifyHttp.post(
      `${this.serviceBaseUrl}/users/${user_id}/assignPermissions`,
      body,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async removePermissions(
    ctx: IContext,
    user_id: string,
    body: PostPermissions,
  ): Promise<void> {
    return this.promisifyHttp.delete(
      `${this.serviceBaseUrl}/users/${user_id}/removePermissions`,
      {
        data: body,
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async addRolesToUser(
    ctx: IContext,
    user_id: string,
    body: PostUserRoleModel,
  ): Promise<void> {
    return this.promisifyHttp.post(
      `${this.serviceBaseUrl}/users/${user_id}/roles`,
      body,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async removeRolesToUser(
    ctx: IContext,
    user_id: string,
    body: PostUserRoleModel,
  ): Promise<void> {
    return this.promisifyHttp.delete(
      `${this.serviceBaseUrl}/users/${user_id}/roles`,
      {
        data: body,
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async findByUsername(
    ctx: IContext,
    connection: string,
    username: string,
  ): Promise<UserModel | undefined> {
    return this.promisifyHttp.post(
      `${this.serviceBaseUrl}/users/findByUsername`,
      {
        params: {
          connection,
          username,
        },
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async paginatePermissions(
    ctx: IContext,
    user_id: string,
    query: PageQuery,
  ): Promise<Page<PermissionModel>> {
    return this.promisifyHttp.get(
      `${this.serviceBaseUrl}/users/${user_id}/permissions`,
      {
        params: query,
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async changePassword(ctx: IContext, user_id: string, password: string) {
    return this.promisifyHttp.post(
      `${this.serviceBaseUrl}/users/${user_id}/change_password`,
      {
        params: {
          password,
        },
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  linkIdentity(ctx: IContext, primaryUserId: string, linkIdentityReq: LinkIdentityReq): Promise<IdentityModel[]> {
      return null;
  }

  unlinkIdentity(ctx: IContext, primaryUserId: string, connection: string, secondaryUserId: string): Promise<IdentityModel[]> {
      return null;
  }

  findByIdentityProvider(ctx: IContext, provider: string, user_id: string): Promise<UserModel> {
      return null;
  }

  listOrganizations(ctx: IContext, user_id: string, query: PageQuery): Promise<Page<OrganizationModel>> {
      return null;
  }

  listRoles(ctx: IContext, user_id: string, query: PageQuery): Promise<Page<UserRoleModel>> {
      return null;
  }

  updateGroupsToUser(ctx: IContext, user_id: string, group_ids: string[], overwrite: boolean): Promise<void> {
      return null;
  }

  startResetPasswordByEmail(ctx: IContext, connection: string, email: string, ip: string): Promise<void> {
      return null;
  }
}
