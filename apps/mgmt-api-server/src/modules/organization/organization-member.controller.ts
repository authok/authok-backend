import { Controller, Inject, Post, Param, Query, Get, Body, Delete, UseGuards } from "@nestjs/common";
import { IOrganizationService, IOrganizationMemberService } from "libs/api/infra-api/src";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { 
  OrganizationMemberDto, 
  AddOrganizationMembersDto, 
  RemoveOrganizationMembersDto, 
  OrganizationMemberPageQueryDto,
} from "libs/dto/src";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { TenantGuard } from "../../middleware/tenant.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";

@Controller('/api/v2/organizations/:org_id/members')
@UseGuards(TenantGuard)
export class OrganizationMemberController {
  constructor(
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
    @Inject('IOrganizationMemberService')
    private readonly organizationMemberService: IOrganizationMemberService,
  ) {}

  @Get(':member_id')
  @Scopes('read:organization_members')
  async get(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Param('member_id') member_id: string,
  ): Promise<OrganizationMemberDto | undefined> {
    return await this.organizationMemberService.retrieve(ctx, member_id) as any;
  }

  @Get('')
  @Scopes('read:organization_members')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Query() _query: OrganizationMemberPageQueryDto,
  ): Promise<PageDto<OrganizationMemberDto>> {
    const query = {..._query, org_id };
  
    return await this.organizationMemberService.paginate(ctx, query) as any;
  }

  @Post('')
  @Scopes('create:organization_members')
  async add(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Body() body: AddOrganizationMembersDto,
  ): Promise<void> {  
    await this.organizationService.addMembers(ctx, org_id, body.members);
  }

  @Delete('')
  @Scopes('delete:organization_members')
  async remove(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Body() body: RemoveOrganizationMembersDto,
  ): Promise<void> {  
    return await this.organizationService.removeMembers(ctx, org_id, body.members);
  }
}