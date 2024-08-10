import {
  Controller,
  Get,
  Post,
  Req,
  Inject,
  Query,
  Body,
  Param,
  NotFoundException,
  Patch,
  Delete,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { OIDCRequest } from '../../types/oidc';
import { UserPageQueryDto } from './user.dto';
import { nanoid } from 'nanoid';
import { ILogService } from 'libs/api/logstream-api/src/log.service';
import {
  LogEventDto,
  LogCursorQueryDto,
} from 'libs/api/logstream-api/src/log.dto';
import { 
  IConnectionService,
  IUserService,
  IGrantService,
} from 'libs/api/infra-api/src';
import { CursorResult } from 'libs/common/src/pagination/cursor/cursor.dto';
import { ApiOperation } from '@nestjs/swagger';
import { TenantGuard } from '../../middleware/tenant.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { 
  UpdateUserDto,
  UserDto,
  CreateUserDto,
  PostPermissionsDto,
  PostUserRoleDto,  
  IdentityDto,
  GrantDto,
  GrantPageQueryDto,
  PermissionDto,
  LinkIdentityReq,
  OrganizationDto, 
  UserRoleDto,
} from 'libs/dto/src';

@Controller('/api/v2/users')
@UseGuards(ScopesGuard)
@UseGuards(TenantGuard)
export class UserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('ILogService') private readonly logService: ILogService,
    @Inject('IGrantService') private readonly grantService: IGrantService,
  ) {}

  @Get(':user_id/grants')
  @Scopes('read:users')
  async paginateGrants(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Query() _query: GrantPageQueryDto,
  ): Promise<PageDto<GrantDto>> {
    const query = { ..._query, user_id };
    return await this.grantService.paginate(ctx, query);
  }

  @Post(':user_id/identities')
  @Scopes('update:users')
  async linkIdentity(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Body() linkIdentityReq: LinkIdentityReq,
  ): Promise<Partial<IdentityDto>[]> {
    return await this.userService.linkIdentity(ctx, user_id, linkIdentityReq);
  }

  @Delete(':user_id/identities/:connection/:secondaryUserId')
  @Scopes('update:users')
  async unlinkIdentity(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Param('connection') connection: string,
    @Param('secondaryUserId') secondaryUserId: string,
  ): Promise<Partial<IdentityDto>[]> {
    return await this.userService.unlinkIdentity(
      ctx,
      user_id,
      connection,
      secondaryUserId,
    );
  }

  @Get()
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: UserPageQueryDto,
  ): Promise<PageDto<UserDto>> {
    return await this.userService.paginate(ctx, query) as any;
  }

  @Get(':user_id')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
  ): Promise<UserDto | undefined> {
    return await this.userService.retrieve(ctx, user_id) as any;
  }

  @Patch(':user_id')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id,
    @Body() data: UpdateUserDto,
  ) {
    return await this.userService.update(ctx, user_id, data);
  }

  @Post()
  @Scopes('create:users')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: OIDCRequest,
    @Body() _user: CreateUserDto,
  ): Promise<UserDto> {
    const connection = await this.connectionService.findByName(
      ctx,
      _user.connection,
    );

    if (!connection) {
      throw new NotFoundException(`connection ${_user.connection} not found`);
    }

    if (connection.strategy != 'authok') {
      Logger.error(`connection ${connection.name} is not a dbconnection`);

      throw new Error('connection is not a dbconnection');
    }

    const user_id = nanoid(24);
    return await this.userService.create(ctx, {
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
    }) as any;
  }

  @Delete('batch')
  @Scopes('delete:users')
  async batchDelete(
    @ReqCtx() ctx: IRequestContext,
    @Body('user_ids') user_ids: string[],
  ) {
    for (const user_id of user_ids) {
      console.log('user_id: ', user_id);
      await this.userService.delete(ctx, user_id);
    }
  }

  @Delete(':user_id')
  @Scopes('delete:users')
  async deleteUser(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
  ) {
    await this.userService.delete(ctx, user_id);
  }

  @Get(':user_id/logs')
  @Scopes('read:users')
  async logs(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Query() _query: LogCursorQueryDto,
  ): Promise<CursorResult<LogEventDto>> {
    const query = { ..._query, user_id };
    return this.logService.cursor(ctx, query);
  }

  @Get(':user_id/permissions')
  @ApiOperation({ summary: 'List permissions of a user' })
  @Scopes('read:users')
  async listPermissions(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<PermissionDto>> {
    return await this.userService.paginatePermissions(ctx, user_id, query);
  }

  @Post(':user_id/permissions')
  @ApiOperation({ summary: 'Add permissions to a user' })
  @Scopes('update:users')
  async assignPermissions(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Body() body: PostPermissionsDto,
  ): Promise<void> {
    return await this.userService.assignPermissions(ctx, user_id, body);
  }

  @Delete(':user_id/permissions')
  @ApiOperation({ summary: 'Remove permission of a user' })
  @Scopes('update:users')
  async removePermissions(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Body() body: PostPermissionsDto,
  ): Promise<void> {
    return await this.userService.removePermissions(ctx, user_id, body);
  }

  @Get(':user_id/roles')
  @ApiOperation({ summary: 'List roles of a user' })
  @Scopes('read:users')
  async listRoles(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<UserRoleDto>> {
    return await this.userService.listRoles(ctx, user_id, query);
  }

  @Post(':user_id/roles')
  @ApiOperation({ summary: 'Assign roles to a user' })
  @Scopes('update:users')
  async addRoles(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Body() body: PostUserRoleDto,
  ) {
    return await this.userService.addRolesToUser(ctx, user_id, body);
  }

  @Delete(':user_id/roles')
  @ApiOperation({ summary: 'Remove roles of a user' })
  @Scopes('update:users')
  async removeRoles(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Body() body: PostUserRoleDto,
  ) {
    return await this.userService.removeRolesToUser(ctx, user_id, body);
  }

  @Get(':user_id/organizations')
  @ApiOperation({ summary: 'List organizations of a user' })
  @Scopes('read:users')
  async listOrganizations(
    @ReqCtx() ctx: IRequestContext,
    @Param('user_id') user_id: string,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<OrganizationDto>> {
    return await this.userService.listOrganizations(ctx, user_id, query);
  }
}
