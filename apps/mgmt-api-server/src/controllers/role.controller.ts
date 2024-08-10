import { Controller, Inject, Get, Query, Req, Post, Body, Delete, Param, Patch, UseGuards } from "@nestjs/common";
import {
  UserDto,
  RoleDto,
  RolePermissionAssignmentDto,
  RoleUsersDto,
  CreateRoleDto,
  UpdateRoleDto,
} from 'libs/dto/src';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination';
import { JoiPipe, UPDATE } from 'nestjs-joi';
import { 
  IRoleService,
  IPermissionService,
  IUserService,
} from 'libs/api/infra-api/src';
import { ApiOperation } from "@nestjs/swagger";
import { TenantGuard } from "../middleware/tenant.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";

@Controller('/api/v2/roles')
@UseGuards(ScopesGuard)
@UseGuards(TenantGuard)
export class RoleController {
  constructor(
    @Inject('IRoleService')
    private readonly roleService: IRoleService,
    @Inject('IPermissionService')
    private readonly permissionService: IPermissionService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取角色列表' })
  // @Scopes('read:roles')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<RoleDto>> {
    return this.roleService.paginate(ctx, query);
  }

  @Post()
  @ApiOperation({ summary: '创建角色' })
  @Scopes('create:roles')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() role: CreateRoleDto,
  ): Promise<RoleDto | undefined> {
    return this.roleService.create(ctx, role);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取' })
  // @Scopes('read:roles')
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
  // @Scopes('update:roles')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body(new JoiPipe({ group: UPDATE })) data: UpdateRoleDto,
  ) {
    return await this.roleService.update(ctx, id, data);
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: '获取角色下的所有权限' })
  // @Scopes('update:roles')
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

  @Delete(':id/permissions')
  @ApiOperation({ summary: '删除权限' })
  // @Scopes('update:roles')
  async removePermissions(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() body: RolePermissionAssignmentDto,
  ) {
    await this.roleService.removePermissions(ctx, id, body);
  }

  @Post(':id/permissions')
  @ApiOperation({ summary: '关联权限到给定role' })
  // @Scopes('update:roles')
  async addPermissions(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() body: RolePermissionAssignmentDto,
  ) {
    await this.roleService.addPermissions(ctx, id, body);
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'List users for role' })
  // @Scopes('read:roles')
  async users(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<UserDto>> {
    return this.userService.paginate(ctx, {
      ...query,
      role_id: id,
    }) as any;
  }

  @Post(':id/users')
  // @Scopes('update:roles')
  async assignUsers(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() data: RoleUsersDto,
  ) {
    return await this.roleService.assignUsers(ctx, id, data);
  }

  @Delete(':id/users')
  @Scopes('')
  // @Scopes('update:roles')
  async unassignUsers(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() data: RoleUsersDto,
  ) {
    return await this.roleService.unassignUsers(ctx, id, data);
  }
}
