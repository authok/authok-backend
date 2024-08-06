import { Controller, Inject, Post, Param, Query, Get, Body, Delete, UseGuards } from "@nestjs/common";
import { IOrganizationMemberService } from "libs/api/infra-api/src/organization/organization-member.service";
import { IOrganizationService } from "libs/api/infra-api/src/organization/organization.service";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { AddOrganizationMembersDto, RemoveOrganizationMembersDto, OrganizationMemberPageQueryDto } from "libs/api/infra-api/src/organization/organization.model";
import { OrganizationMemberDto } from "libs/api/infra-api/src/organization/organization-member.dto";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { TenantGuard } from "../../middleware/tenant.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";

@Controller('/api/v1/organizations')
@UseGuards(TenantGuard)
export class OrganizationMemberController {
  constructor(
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
    @Inject('IOrganizationMemberService')
    private readonly organizationMemberService: IOrganizationMemberService,
  ) {}

  @Get(':org_id/members/:member_id')
  @Scopes('read:organization_members')
  async get(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Param('member_id') member_id: string,
  ): Promise<OrganizationMemberDto | undefined> {
    return await this.organizationMemberService.retrieve(ctx, member_id);
  }

  @Get(':org_id/members')
  @Scopes('read:organization_members')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Query() _query: OrganizationMemberPageQueryDto,
  ): Promise<PageDto<OrganizationMemberDto>> {
    const query = {..._query, org_id };
  
    return await this.organizationMemberService.paginate(ctx, query);
  }

  @Post(':org_id/members')
  @Scopes('create:organization_members')
  async add(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Body() body: AddOrganizationMembersDto,
  ): Promise<void> {  
    await this.organizationService.addMembers(ctx, org_id, body.members);
  }

  @Delete(':org_id/members')
  @Scopes('delete:organization_members')
  async remove(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Body() body: RemoveOrganizationMembersDto,
  ): Promise<void> {  
    return await this.organizationService.removeMembers(ctx, org_id, body.members);
  }
}