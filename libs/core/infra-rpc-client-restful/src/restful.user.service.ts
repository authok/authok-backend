import { Injectable, Param } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IdentityDto } from 'libs/api/infra-api/src/identity/identity.dto';
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserPageQueryDto,
  PostPermissionsDto,
} from 'libs/api/infra-api/src/user/user.dto';
import { IUserService } from 'libs/api/infra-api/src/user/user.service';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IRequestContext, IContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { PostUserRoleDto } from 'libs/api/infra-api/src/role/role.dto';
import { PermissionDto } from 'libs/api/infra-api/src/permission/permission.dto';
import { IdentifierType } from 'libs/core/authentication-core/src/credentials';

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
    ctx: IRequestContext,
    user: CreateUserDto,
  ): Promise<UserDto | null> {
    return await this.promisifyHttp.post(`${this.serviceBaseUrl}/users`, user, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async createByFederatedIdentity(
    ctx: IRequestContext,
    identity: Partial<IdentityDto>,
  ): Promise<UserDto> {
    return await this.promisifyHttp.post(`${this.serviceBaseUrl}/users/createByFederatedIdentity`, identity, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async retrieve(
    ctx: IRequestContext,
    user_id: string,
  ): Promise<UserDto | undefined> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/users/${user_id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async findByGuid(
    ctx: IRequestContext,
    guid: string,
  ): Promise<UserDto | undefined> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/users/findByGuid/${guid}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async userVerifiedEmail(ctx: IRequestContext, user_id: string) {
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
    ctx: IRequestContext,
    user: UserDto,
    password: string,
  ) {
    // TODO
    return undefined;
  }

  async enable2fa(ctx: IRequestContext, user_id: string): Promise<void> {
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

  async disable2fa(ctx: IRequestContext, user_id: string): Promise<void> {
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
    ctx: IRequestContext,
    email: string,
  ): Promise<UserDto | undefined> {
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
    ctx: IRequestContext,
    phone_number: string,
  ): Promise<UserDto | undefined> {
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
    ctx: IRequestContext,
    username: string,
  ): Promise<UserDto | undefined> {
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
    ctx: IRequestContext,
    id: string,
    data: Partial<UpdateUserDto>,
  ): Promise<UserDto> {
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

  async delete(ctx: IRequestContext, user_id: string): Promise<void> {
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
    ctx: IRequestContext,
    query: UserPageQueryDto,
  ): Promise<PageDto<UserDto>> {
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
  ): Promise<UserDto | undefined> {
    // TODO
    return null;
  }

  async updateFederatedIdentity(ctx: IRequestContext, identity: IdentityDto) {
    // TODO
    return null;
  }

  async addFederatedIdentity(ctx: IRequestContext, user_id: string, identity: IdentityDto) {
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
  ): Promise<UserDto | undefined> {
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
}
