import { Controller, Get, Param, Query, Inject, UseGuards, Post, Scope, Body, NotFoundException, Req, Delete } from "@nestjs/common";
import { IInvitationService } from "libs/api/infra-api/src/invitation/invitation.service";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { InvitationDto, InvitationPageQueryDto } from "libs/api/infra-api/src/invitation/invitation.dto";
import { TenantGuard } from "../../middleware/tenant.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { IOrganizationService } from "libs/api/infra-api/src/organization/organization.service";
import * as moment from 'moment';
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";
import { OIDCRequest } from "../../types/oidc";

@Controller('/api/v1/organizations/:org_id/invitations')
@UseGuards(TenantGuard, ScopesGuard)
export class OrganizationInvitationController {
  constructor(
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
    @Inject('IInvitationService')
    private readonly invitationService: IInvitationService,
  ) {}

  @Get()
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Query() _query: InvitationPageQueryDto,
  ): Promise<PageDto<InvitationDto>> {
    const query = {..._query, org_id };
    return await this.invitationService.paginate(ctx, query);
  }

  @Post()
  @Scopes('update:organizations')
  async create(
    @Req() req: OIDCRequest,
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Body() _invitation: InvitationDto,
  ) {
    const inviter = {
      user_id: req.user.sub,
    }

    // 在当前租户名下找不到 对应的 org
    const org = await this.organizationService.retrieve(ctx, org_id);
    if (!org) throw new NotFoundException(`organization ${org_id} not found`);

    const expires_at = moment(new Date()).add(7, 'd').toDate();

    const invitation = {..._invitation, inviter, org_id, expires_at };

    return await this.invitationService.create(ctx, invitation);
  }

  @Get(':invitation_id')
  @Scopes('read:organizations')
  async get(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Param('invitation_id') invitation_id: string,
  ): Promise<InvitationDto | undefined> {
    
    const invitation = await this.organizationService.getInvitation(ctx, org_id, invitation_id);
    if (!invitation) throw new NotFoundException(`invitation ${invitation_id} not found`);
    return invitation;
  }

  @Delete(':invitation_id')
  @Scopes('update:organizations')
  async remove(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Param('invitation_id') invitation_id: string,
  ): Promise<void> {
    await this.organizationService.removeInvitation(ctx, org_id, invitation_id);
  }
}