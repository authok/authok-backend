import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  Patch,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';

import {
  RoleDto,
  RolePermissionAssignmentDto,
  RoleUsersDto,
  CreateRoleDto,
  UpdateRoleDto,
} from 'libs/dto/src';
import { UserDto } from 'libs/dto/src';
import { 
  IRoleService,
  IPermissionService,
  IUserService,
} from 'libs/api/infra-api/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { CREATE, JoiPipe, UPDATE } from 'nestjs-joi';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';

@ApiTags('角色')
@Controller('/api/v2/roles')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class RoleController {
  constructor(
    @Inject('IRoleService')
    private readonly roleService: IRoleService,
    @Inject('IPermissionService')
    private readonly permissionService: IPermissionService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @ApiOperation({ summary: '获取角色列表', description: '获取角色列表' })
  @Get()
  @Scopes('read:roles')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<RoleDto>> {
    // TODO
    return this.roleService.paginate(ctx, query);
  }

  @ApiOperation({ summary: '创建角色', description: '创建角色' })
  @Post()
  @Scopes('create:roles')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body(new JoiPipe({ group: CREATE })) role: CreateRoleDto,
  ): Promise<RoleDto | undefined> {
    return this.roleService.create(ctx, role);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取' })
  @Scopes('read:roles')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<RoleDto | undefined> {
    return this.roleService.retrieve(ctx, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  @Scopes('delete:roles')
  async delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string) {
    return await this.roleService.delete(ctx, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新' })
  @Scopes('update:roles')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body(new JoiPipe({ group: UPDATE })) data: UpdateRoleDto,
  ) {
    return await this.roleService.update(ctx, id, data);
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: '获取权限' })
  @Scopes('read:roles')
  async permissions(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Query() _query: PageQueryDto,
  ) {
    return await this.permissionService.paginate(ctx, {
      ..._query,
      role_id: id,
    });
  }

  @ApiOperation({ summary: '删除权限', description: '删除权限' })
  @Delete(':id/permissions')
  @Scopes('update:roles')
  async removePermissions(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() body: RolePermissionAssignmentDto,
  ) {
    await this.roleService.removePermissions(ctx, id, body);
  }

  @ApiOperation({ summary: '关联权限到给定role', description: '关联权限到给定role' })
  @Post(':id/permissions')
  @Scopes('update:roles')
  async addPermissions(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() body: RolePermissionAssignmentDto,
  ) {
    await this.roleService.addPermissions(ctx, id, body);
  }

  @ApiOperation({ summary: '获取给定role的用户', description: '获取给定role的用户' })
  @Get(':id/users')
  @Scopes('update:roles')
  async users(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<UserDto>> {
    const { meta, items: _items } = await this.userService.paginate(ctx, {
      ...query,
      role_id: id,
    });

    const items = _items.map(it => it as unknown as UserDto);

    return {
      meta,
      items,
    }
  }

  @ApiOperation({ summary: '分配角色给指定用户', description: '分配角色给指定用户' })
  @Post(':id/users')
  @Scopes('update:roles')
  async assignUsers(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() data: RoleUsersDto,
  ) {
    return await this.roleService.assignUsers(ctx, id, data);
  }

  @ApiOperation({ summary: '从指定用户移除角色', description: '从指定用户移除角色' })
  @Delete(':id/users')
  @Scopes('update:roles')
  async unassignUsers(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() data: RoleUsersDto,
  ) {
    return await this.roleService.unassignUsers(ctx, id, data);
  }
}
