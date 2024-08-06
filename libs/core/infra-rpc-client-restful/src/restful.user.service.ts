import { Injectable, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PostPermissionsDto,
} from 'libs/api/infra-api/src/user/user.dto';
import { IUserService } from 'libs/api/infra-api/src/user/user.service';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IRequestContext, IContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { PostUserRoleDto } from 'libs/api/infra-api/src/role/role.dto';
import { PermissionDto } from 'libs/api/infra-api/src/permission/permission.model';
import { IdentityModel } from 'libs/api/infra-api/src/identity/identity.model';
import { CreateUserModel, UpdateUserModel, UserModel } from 'libs/api/infra-api/src/user/user.model';
import { PageQuery } from 'libs/common/src/pagination/pagination.model';
import { LinkIdentityReq } from 'libs/api/infra-api/src/identity/identity.dto';
import { OrganizationDto } from 'libs/api/infra-api/src/organization/organization.model';
import { UserRoleDto } from 'libs/api/infra-api/src/user/user-role.dto';

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
  ): Promise<PageDto<UserModel>> {
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

  async updateFederatedIdentity(ctx: IRequestContext, identity: IdentityModel) {
    // TODO
    return null;
  }

  async addFederatedIdentity(ctx: IRequestContext, user_id: string, identity: IdentityModel) {
    // TODO
    return null;
  }

  async removeFederatedIdentity(ctx: IRequestContext, user_id: string, provider: string) {
    // TODO
    return null;
  }

  async assignPermissions(
    ctx: IRequestContext,
    user_id: string,
    body: PostPermissionsDto,
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
    ctx: IRequestContext,
    user_id: string,
    body: PostPermissionsDto,
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
    ctx: IRequestContext,
    user_id: string,
    body: PostUserRoleDto,
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
    ctx: IRequestContext,
    user_id: string,
    body: PostUserRoleDto,
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
    ctx: IRequestContext,
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
    ctx: IRequestContext,
    user_id: string,
    query: PageQueryDto,
  ): Promise<PageDto<PermissionDto>> {
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

  async changePassword(ctx: IRequestContext, user_id: string, password: string) {
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

  listOrganizations(ctx: IContext, user_id: string, query: PageQueryDto): Promise<PageDto<OrganizationDto>> {
      return null;
  }

  listRoles(ctx: IContext, user_id: string, query: PageQueryDto): Promise<PageDto<UserRoleDto>> {
      return null;
  }

  updateGroupsToUser(ctx: IContext, user_id: string, group_ids: string[], overwrite: boolean): Promise<void> {
      return null;
  }

  startResetPasswordByEmail(ctx: IContext, connection: string, email: string, ip: string): Promise<void> {
      return null;
  }
}
