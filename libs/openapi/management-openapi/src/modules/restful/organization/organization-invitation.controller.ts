import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Inject,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { 
  IOrganizationService,
  IInvitationService,
} from 'libs/api/infra-api/src';
import { PageDto } from 'libs/common/src/pagination';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { AuthGuard } from '@nestjs/passport';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import dayjs from 'dayjs';
import { InvitationDto, InvitationPageQueryDto } from "libs/dto/src/invitation/invitation.dto";

@Controller('/api/v2/organizations/:org_id/invitations')
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
export class OrganizationInvitationController {
  constructor(
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
    @Inject('IInvitationService')
    private readonly invitationService: IInvitationService,
  ) {}

  @ApiOperation({
    summary: '获取邀请列表',
    description: '获取邀请列表',
  })
  @Get()
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Query() _query: InvitationPageQueryDto,
  ): Promise<PageDto<InvitationDto>> {
    const query = {..._query, org_id };
    const { meta, items: _items } = await this.invitationService.paginate(ctx, query);

    const items = _items.map(it => it as unknown as InvitationDto);
  
    return {
      meta,
      items,
    }
  }

  @ApiOperation({
    summary: '创建邀请',
    description: '创建邀请',
  })
  @Post()
  @Scopes('update:organizations')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Body() _invitation: InvitationDto,
  ) {
    const inviter = {
      user_id: ctx.req.user.sub,
    }

    // 在当前租户名下找不到 对应的 org
    const org = await this.organizationService.retrieve(ctx, org_id);
    if (!org) throw new NotFoundException(`organization ${org_id} not found`);

    const expires_at = dayjs(new Date()).add(7, 'd').toDate();

    const invitation = {..._invitation, inviter, org_id, expires_at };

    return await this.invitationService.create(ctx, invitation);
  }

  @ApiOperation({
    summary: '获取邀请',
    description: '获取邀请',
  })
  @Get(':invitation_id')
  @Scopes('read:organizations')
  async get(
    @ReqCtx() ctx: IRequestContext,
    @Param('org_id') org_id: string,
    @Param('invitation_id') invitation_id: string,
  ): Promise<InvitationDto | undefined> {
    
    const invitation = await this.organizationService.getInvitation(ctx, org_id, invitation_id);
    if (!invitation) throw new NotFoundException(`invitation ${invitation_id} not found`);
    return invitation as unknown as InvitationDto;
  }

  @ApiOperation({
    summary: '删除邀请',
    description: '删除邀请',
  })
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