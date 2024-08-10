import { Controller, Inject, Post, Param, Query, Get, Body, Delete, UseGuards, NotFoundException } from "@nestjs/common";
import { 
  IOrganizationMemberService,
  IOrganizationMemberRoleService,
} from "libs/api/infra-api/src";
import { OrganizationMemberRolePageQueryDto, OrganizationMemberAddRolesDto, OrganizationMemberRemoveRolesDto, RoleDto } from "libs/dto/src";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { IRequestContext, ReqCtx } from "@libs/nest-core";
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { AuthGuard } from "@nestjs/passport";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";

@Controller('/api/v2/organizations')
@ApiTags('组织')
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
export class OrganizationMemberRoleController {
  constructor(
    @Inject('IOrganizationMemberService')
    private readonly organizationMemberService: IOrganizationMemberService,
    @Inject('IOrganizationMemberRoleService')
    private readonly organizationMemberRoleService: IOrganizationMemberRoleService,
  ) {}

  @ApiOperation({
    summary: 'Get user roles assigned to an organization member.',
    description: 'Get user roles assigned to an organization member.',
  })
  @Get(':org_id/members/:user_id/roles')
  @Scopes('read:organization_members')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Param('user_id') user_id: string,
    @Query() _query: OrganizationMemberRolePageQueryDto,
  ): Promise<PageDto<RoleDto>> {
    const query = {..._query, org_id, user_id };
  
    const memberRoles = await this.organizationMemberRoleService.paginate(ctx, query);
    return {
      items: memberRoles.items.map(it => ({ id: it.role.id, name: it.role.name, description: it.role.description })),
      meta: memberRoles.meta, 
    }
  }

  @ApiOperation({
    summary: 'Assign user roles to an organization member.',
    description: 'Assign user roles to an organization member.',
  })
  @Post(':org_id/members/:user_id/roles')
  @Scopes('update:organizations')
  async add(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Param('user_id') user_id: string,
    @Body() data: OrganizationMemberAddRolesDto,
  ): Promise<void> {
    const member = await this.organizationMemberService.findByRelation(ctx, org_id, user_id);
    if (!member) {
      throw new NotFoundException();
    }

    await this.organizationMemberService.addRoles(ctx, member.id, data.roles);
  }

  @ApiOperation({
    summary: 'Delete user roles from an organization member.',
    description: 'Delete user roles from an organization member.',
  })
  @Delete(':org_id/members/:user_id/roles')
  @Scopes('update:organizations')
  async remove(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Param('user_id') user_id: string,
    @Body() data: OrganizationMemberRemoveRolesDto,
  ): Promise<void> {
    const member = await this.organizationMemberService.findByRelation(ctx, org_id, user_id);
    if (!member) {
      throw new NotFoundException();
    }

    await this.organizationMemberService.removeRoles(ctx, member.id, data.roles);
  }
}