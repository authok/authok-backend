import {
  Controller,
  Patch,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Req,
  Inject,
  Query,
  UseGuards,
  UseInterceptors,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import {
  CacheTTL,
  CacheInterceptor,
} from '@nestjs/cache-manager';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { 
  IUserService,
  IRoleService,
  IConnectionService,
  IIdentityService,
} from 'libs/api/infra-api/src';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { Request } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  PageDto,
  PageQueryDto,
  pageDtoFactory,
} from 'libs/common/src/pagination/pagination.dto';
import {
  UserDto,
  RecoveryCodeRegenerationDto,
  CreateUserDto,
  UpdateUserDto,
  UserPageQueryDto,
  PostPermissionsDto,
  OrganizationPageDto,
  CreateIdentityDto,
  IdentityDto,
  LinkIdentityReq,
  OrganizationDto,
  PermissionDto,
  PostUserRoleDto,
  RoleDto,
} from 'libs/dto/src';
import * as jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { APIException } from 'libs/common/src/exception/api.exception';
import { getSchemaPath } from '@nestjs/swagger';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiTags('User')
@Controller('/api/v2/users')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IRoleService')
    private readonly roleService: IRoleService,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IIdentityService')
    private readonly identityService: IIdentityService,
  ) {}

  @Get('/:user_id')
  @ApiOperation({ description: 'Get a User by ID', summary: 'Get a User by ID' })
  @ApiOkResponse({
    type: UserDto,
  })
  @Scopes('read:users')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
  ): Promise<UserDto | null> {
    const user = await this.userService.retrieve(ctx, user_id);
    if (!user) throw new NotFoundException();

    const { roles: userRoles, ...rest } = user;
    const roles = userRoles?.map(it => it.role);
    return { ...rest, roles };
  }

  @Post()
  @ApiOperation({ description: 'Create a user', summary: 'Create a user' })
  @ApiOkResponse({
    type: UserDto,
  })
  @Scopes('create:users')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() _user: CreateUserDto,
    @Req() req: Request,
  ): Promise<UserDto> {
    const connection = await this.connectionService.findByName(
      ctx,
      _user.connection,
    );

    if (!connection) {
      throw new APIException(
        'invalid_request',
        `connection ${_user.connection} not found`,
      );
    }

    if (connection.strategy != 'authok') {
      Logger.error(`connection ${connection.name} is not a dbconnection`);

      throw new APIException(
        'invalid_request',
        'connection is not a dbconnection',
      );
    }

    const user_id = _user.user_id ?? nanoid(24);

    const user = await this.userService.create(ctx, {
      ..._user,
      user_id: connection.strategy + '|' + user_id,
      identities: [
        {
          user_id,
          connection: connection.name,
          provider: connection.strategy,
          is_social: false,
        } as IdentityDto,
      ],
      signup_ip: req.ip,
      last_ip: req.ip,
      signup_at: new Date(),
    });

    const { roles: userRoles, ...rest } = user;
    const roles = userRoles?.map(it => it.role);
    return { ...rest, roles };

  }

  @Patch(':user_id')
  @ApiOperation({ summary: 'Update a User' })
  @ApiOkResponse({
    type: UserDto,
    description: 'User',
  })
  @Scopes('update:users')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Body() input: UpdateUserDto,
  ): Promise<UserDto | null> {
    const user = await this.userService.update(ctx, user_id, input);

    const { roles: userRoles, ...rest } = user;
    const roles = userRoles?.map(it => it.role);
    return { ...rest, roles };
  }

  @Delete(':user_id')
  @ApiOperation({ summary: '删除用户' })
  @Scopes('delete:users')
  async delete(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
  ) {
    await this.userService.delete(ctx, user_id);
  }

  @Get()
  @ApiOperation({ summary: '分页查找用户' })
  @Scopes('read:users')
  @ApiOkResponse({
    type: pageDtoFactory(UserDto),
    description: '返回用户列表',
  })
  @Scopes('read:users')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: UserPageQueryDto,
  ): Promise<PageDto<UserDto>> {
    const { meta, items: _items } = await this.userService.paginate(ctx, query);

    const items = _items.map(user => {
      const { roles: userRoles, ...rest } = user;
      const roles = userRoles?.map(it => it.role);
      return { ...rest, roles };
    })

    return {
      meta,
      items,
    }
  }

  @Get('/by-provider/:provider/user_id/:user_id')
  @ApiOperation({
    description: 'Get User by provider',
    summary: 'Get User by provider',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @Scopes('read:users')
  async findByIdentityProvider(
    @ReqCtx() ctx: IRequestContext,
    @Param('provider') provider: string,
    @Param('user_id') user_id: string,
  ): Promise<UserDto | null> {
    const user = await this.userService.findByIdentityProvider(
      ctx,
      provider,
      user_id,
    );
    if (!user) throw new NotFoundException();
    
    const { roles: userRoles, ...rest } = user;
    const roles = userRoles?.map(it => it.role);
    return { ...rest, roles };  
  }

  @Post('/create-by-identity-provider')
  @ApiOperation({
    description: '根据给定身份提供者信息创建新用户',
    summary: '根据给定身份提供者信息创建新用户',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @Scopes('create:users')
  async createByIdentityProvider(
    @ReqCtx() ctx: IRequestContext,
    @Body() data: CreateIdentityDto,
    @Req() req: Request,
  ): Promise<UserDto> {
    const identity = data as IdentityDto;

    const connection = await this.connectionService.findByName(
      ctx,
      identity.connection,
    );

    if (!connection) {
      throw new APIException(
        'invalid_request',
        `connection ${identity.connection} not found`,
      );
    }

    // 自定义身份源
    if (connection.strategy === 'oauth2') {
      identity.provider = identity.connection;
    } else {
      identity.provider = connection.strategy;
    }

    if (connection.strategy === 'authok') {
      Logger.error(`connection ${connection.name} must not be dbconnection`);

      throw new APIException(
        'invalid_request',
        'connection must not be dbconnection',
      );
    }

    let federatedUser = await this.userService.findByIdentityProvider(
      ctx,
      identity.provider,
      identity.user_id,
    );

    const now = new Date();

    // 不存在就创建新用户
    if (!federatedUser) {
      Logger.debug(
        `没有找到 联合登录账户,  connection: ${connection.name}, user_id: ${identity.user_id}, nickname: ${identity.profile_data.nickname}`,
      );

      // 创建新user
      federatedUser = await this.userService.create(ctx, {
        user_id: identity.provider + '|' + identity.user_id,
        name: identity.profile_data.name,
        connection: identity.connection,
        // username: identity.profile_data.username,
        nickname: identity.profile_data.nickname,
        picture: identity.profile_data.picture,
        signup_ip: req.ip,
        last_ip: req.ip,
        signup_at: now,
        last_login: now,
        identities: [identity],
      });
    } else {
      // 把 identity 合并到主 user

      Logger.debug(
        `找到 联合登录账户,  connection: ${connection.name}, user_id: ${identity.user_id}, nickname: ${identity.profile_data.nickname}`,
      );

      const targetIdentity = federatedUser.identities.find(
        (it) =>
          identity.user_id == it.user_id &&
          identity.connection == it.connection,
      );

      if (targetIdentity) {
        await this.identityService.update(ctx, targetIdentity.id, {
          is_social: identity.is_social,
          access_token: identity.access_token,
          expires_in: identity.expires_in,
          refresh_token: identity.refresh_token,
          last_login: now,
          profile_data: identity.profile_data,
        });

        Logger.log(
          `更新 身份源对应的 identity, connection: ${connection.name}, identity id: ${targetIdentity.id}`,
        );
      } else {
        // XXX 应该不会走到这里
        // 新建身份源对应的 identity
        const newIdentity = await this.userService.addFederatedIdentity(
          ctx,
          federatedUser.user_id,
          {
            ...identity,
            last_login: now,
          },
        );

        Logger.warn(
          `WARNING: 新建 身份源对应的 identity, connection: ${connection.name}, identity id: ${newIdentity.user_id}, 已经根据 provider + user_id 找到 user, 应该不会走到这里.`,
        );
      }

      if (connection.options.set_user_root_attributes) {
        Logger.log(
          `更新 主档案, connection: ${connection.name}, user_id: ${federatedUser.user_id}`,
        );

        await this.userService.update(ctx, federatedUser.user_id, {
          // username: profile_data.username,
          nickname: identity.profile_data.nickname,
          gender: identity.profile_data.gender,
          picture: identity.profile_data.picture,
          last_login: now,
          last_ip: req.ip,
        } as Partial<UpdateUserDto>);
      } else {
        Logger.log(
          `不更新主档案 identity, strategy: ${connection.strategy}, user_id: ${federatedUser.user_id}`,
        );
      }
    }

    const { roles: userRoles, ...rest } = federatedUser;
    const roles = userRoles?.map(it => it.role);
    return { ...rest, roles };
  }

  @Post(':user_id/permissions')
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiOperation({ description: 'Add permissions to user', summary: 'Add permissions to user' })
  @Scopes('update:users')
  async assignPermissions(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Body() body: PostPermissionsDto,
  ): Promise<void> {
    return await this.userService.assignPermissions(ctx, user_id, body);
  }

  @Delete(':user_id/permissions')
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiOperation({
    description: 'Remove permission of a user',
    summary: 'Remove permission of a user',
  })
  @Scopes('update:users')
  async removePermissions(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Body() body: PostPermissionsDto,
  ): Promise<void> {
    return await this.userService.removePermissions(ctx, user_id, body);
  }

  @ApiOperation({ summary: 'List permissions of a user' })
  @ApiOkResponse({
    type: pageDtoFactory(PermissionDto),
  })
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @Get(':user_id/permissions')
  @CacheTTL(20)
  @UseInterceptors(CacheInterceptor)
  @Scopes('read:users')
  async listPermissions(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<PermissionDto>> {
    return await this.userService.paginatePermissions(ctx, user_id, query);
  }

  @Get(':user_id/roles')
  @ApiOperation({
    summary: 'List roles of a user',
    description: 'List roles of a user',
  })
  @ApiOkResponse({
    type: pageDtoFactory(PermissionDto),
  })
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @Scopes('read:users')
  async listRoles(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<RoleDto>> {
    return await this.roleService.paginate(ctx, {
      ...query,
      user_id,
    });
  }

  @Post(':user_id/roles')
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiOperation({ summary: 'Assign role to user', description: 'Assign role to user' })
  @Scopes('update:users')
  async addRoles(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Body() body: PostUserRoleDto,
  ) {
    return await this.userService.addRolesToUser(ctx, user_id, body);
  }

  @Delete(':user_id/roles')
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiOperation({ summary: 'Remove role of a user' })
  @Scopes('update:users')
  async removeRoles(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Body() body: PostUserRoleDto,
  ) {
    return await this.userService.removeRolesToUser(ctx, user_id, body);
  }

  @Post(':user_id/identities')
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @ApiOperation({ 
    summary: 'Link a user account', 
    description: 'Link two user accounts together forming a primary and secondary relationship. On successful linking, the endpoint returns the new array of the primary account identities.' })
  @ApiOkResponse({ type: [IdentityDto] })
  @Scopes('update:users')
  async linkIdentity(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Body() _req: LinkIdentityReq,
  ): Promise<IdentityDto[]> {
    const userScope: string = ctx.req.user.scope; //as a string e.g: 'create:user update:user'
    const userScopes = userScope.split(' ');

    let secondaryUserId;
    let connection;
    let provider;
    if (_req.link_with) {
      if (!userScopes.includes('update:current_user_identities')) {
        throw new ForbiddenException();
      }

      const { header, payload } = jwt.decode(_req.link_with, {
        complete: true,
      }) as {
        [key: string]: any;
      };
      secondaryUserId = payload.sub;

      const secondaryUser = await this.userService.retrieve(
        ctx,
        secondaryUserId,
      );
      if (!secondaryUser)
        throw new APIException('invalid_request', '被关联用户不存在');

      connection = secondaryUser.connection;

      console.log('xxxb', header, payload);
    } else {
      if (!userScopes.includes('update:users')) {
        throw new ForbiddenException();
      }

      secondaryUserId = _req.user_id;
      connection = _req.connection;
    }

    const req = {
      user_id: secondaryUserId,
      connection,
      provider,
    };

    return await this.userService.linkIdentity(ctx, user_id, req);
  }

  @ApiOperation({ summary: '解除账号关联', description: '解除账号关联' })
  @ApiParam({ name: 'primary_user_id', description: '主账户ID' })
  @ApiParam({ name: 'connection', description: '身份源标识符' })
  @ApiParam({
    name: 'secondary_user_id',
    description: '从账户ID, 这里是身份提供者的USERID, "|"之后的字符串',
  })
  @Delete(':primary_user_id/identities/:connection/:secondary_user_id')
  @Scopes('update:users')
  async unlinkIdentity(
    @ReqCtx() ctx: IRequestContext,
    @Param('primary_user_id') primary_user_id: string,
    @Param('connection') connection: string,
    @Param('secondary_user_id') secondary_user_id: string,
  ): Promise<Partial<IdentityDto>[]> {
    return await this.userService.unlinkIdentity(
      ctx,
      primary_user_id,
      connection,
      secondary_user_id,
    );
  }

  @Get(':user_id/organizations')
  @ApiOperation({
    summary: 'List organizations of a user',
    description: 'List organizations of a user',
  })
  @ApiExtraModels(OrganizationPageDto, OrganizationDto)
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(OrganizationPageDto) },
        { type: 'array', items: { $ref: getSchemaPath(OrganizationDto) }},
      ],
    },
  })
  @ApiParam({ name: 'user_id', description: 'User ID' })
  @Scopes('read:users')
  async listOrganizations(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Query() query: PageQueryDto,
  ): Promise<OrganizationPageDto | [OrganizationDto]> {
    const page = await this.userService.listOrganizations(ctx, user_id, query);
    if (query.include_totals) {
      return {
        organizations: page.items,
        start: (query.page -1) * query.per_page,
        limit: query.per_page,
        total: page.meta.total,
      }
    } else {
      return page.items as any;
    }
  }

  @Post(':id/recovery-code-regeneration')
  @ApiOperation({ summary: '' })
  @Scopes('update:users')
  async recoveryCodeRegeneration(
    @Param('id') id: string,
  ): Promise<RecoveryCodeRegenerationDto | undefined> {
    // TODO
    return {
      recovery_code: '',
    };
  }

  @Post(':id/multifactor/actions/invalidate-remember-browser')
  @ApiOperation({
    summary:
      'Invalidate all remembered browsers across all authentication factors for a user.',
  })
  @Scopes('update:users')
  async invalidateRememberBrowser(@Param() id: string) {
    // TODO
  }
}
