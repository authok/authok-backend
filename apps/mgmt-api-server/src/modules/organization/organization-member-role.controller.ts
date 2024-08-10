import { Controller, Inject, Post, Param, Query, Get, Body, Delete, UseGuards } from "@nestjs/common";
import { 
  IOrganizationMemberService,
  IOrganizationMemberRoleService,
} from "libs/api/infra-api/src";
import { 
  OrganizationMemberRolePageQueryDto, 
  OrganizationMemberRoleDto, 
  OrganizationMemberAddRolesDto, 
  OrganizationMemberRemoveRolesDto,
} from "libs/dto/src";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { TenantGuard } from "../../middleware/tenant.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";

@Controller('/api/v2/organizations/:org_id/members/:member_id/roles')
@UseGuards(TenantGuard)
export class OrganizationMemberRoleController {
  constructor(
    @Inject('IOrganizationMemberService')
    private readonly organizationMemberService: IOrganizationMemberService,
    @Inject('IOrganizationMemberRoleService')
    private readonly organizationMemberRoleService: IOrganizationMemberRoleService,
  ) {}

  @Get('')
  @Scopes('read:organization_members')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Param('member_id') member_id: string,
    @Query() _query: OrganizationMemberRolePageQueryDto,
  ): Promise<PageDto<OrganizationMemberRoleDto>> {
    const query = {..._query, 'member.org_id': org_id, member_id };
  
    return await this.organizationMemberRoleService.paginate(ctx, query) as any;
  }

  @Post('')
  @Scopes('update:organizations')
  async add(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Param('member_id') member_id: string,
    @Body() data: OrganizationMemberAddRolesDto,
  ): Promise<void> {
    // TODO 要校验 org_id 有效性    

    await this.organizationMemberService.addRoles(ctx, member_id, data.roles);
  }

  @Delete('')
  @Scopes('update:organizations')
  async remove(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Param('member_id') member_id: string,
    @Body() data: OrganizationMemberRemoveRolesDto,
  ): Promise<void> {  
    await this.organizationMemberService.removeRoles(ctx, member_id, data.roles);
  }
}