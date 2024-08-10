import { Controller, Inject, Post, Body, Req, NotFoundException, BadRequestException, Query, Get, Param, Delete } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OIDCRequest } from "../../types/oidc";
import dayjs from 'dayjs';
import { PageDto } from "libs/common/src/pagination";
import { ReqCtx, IRequestContext } from "@libs/nest-core";
import { InvitationDto, InvitationPageQueryDto } from "libs/dto/src";
import { IInvitationService, IOrganizationService } from "libs/api/infra-api/src";

@Controller('/api/v2/tenants/invitations')
export class TenantInvitationController {
  constructor(
    @Inject('IInvitationService') private readonly invitationService: IInvitationService,
    @Inject('IOrganizationService') private readonly organizationService: IOrganizationService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async sendInvitation(
    @Req() req: OIDCRequest,
    @Body() _invitation: InvitationDto,
  ): Promise<InvitationDto> {
    const tenant = this.configService.get('management.tenant');

    const inviter = {
      user_id: req.user.sub,
    }

    const expires_at = dayjs(new Date()).add(7, 'd').toDate();

    const invitation = {..._invitation, inviter, org_id: req.user.org_id, expires_at };

    return await this.invitationService.create({ tenant }, invitation) as any;
  }

  @Get()
  async listInvitations(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: InvitationPageQueryDto,
  ): Promise<PageDto<InvitationDto>> {
    const tenant = this.configService.get('management.tenant');

    return await this.invitationService.paginate({ tenant }, { ...query, org_id: ctx.tenant }) as any;
  }

  @Delete(':id')
  async removeInvitation(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<void> {
    const tenant = this.configService.get('management.tenant');

    await this.organizationService.removeInvitation({ tenant }, ctx.tenant, id);
  }
}