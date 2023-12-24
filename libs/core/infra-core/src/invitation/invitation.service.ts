import { Injectable, Inject } from '@nestjs/common';

import { IInvitationService } from 'libs/api/infra-api/src/invitation/invitation.service';
import { IInvitationRepository } from 'libs/api/infra-api/src/invitation/invitation.repository';
import { IRequestContext, Query, Filter, IContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';
import { IClientRepository } from 'libs/api/infra-api/src/client/client.repository';
import { APIException } from 'libs/common/src/exception/api.exception';
import { URL } from 'url';
import { nanoid } from 'nanoid';
import { IOrganizationRepository } from 'libs/api/infra-api/src/organization/organization.repository';
import { InvitationDto } from 'libs/api/infra-api/src/invitation/invitation.dto';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { UserDto } from 'libs/api/infra-api/src/user/user.dto';

@Injectable()
export class InvitationService implements IInvitationService {
  constructor(
    @Inject('IInvitationRepository')
    private readonly invitationRepository: IInvitationRepository,
    @Inject('IClientRepository')
    private readonly clientRepository: IClientRepository,
    @Inject('IOrganizationRepository')
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<InvitationDto | undefined> {
    const invitation = await this.invitationRepository.getById(ctx, id);
    if (!invitation) return undefined;

    const inviter = await this.invitationRepository.findRelation(
      ctx,
      UserDto,
      'inviter',
      invitation,
    );

    invitation.inviter = inviter;

    return invitation;
  }

  async findByTicket(
    ctx: IRequestContext,
    ticket: string,
  ): Promise<InvitationDto | undefined> {
    return await this.invitationRepository.findByTicket(ctx, ticket);
  }

  async create(
    ctx: IRequestContext,
    invitation: InvitationDto,
  ): Promise<InvitationDto> {
    const organization = await this.organizationRepository.findById(ctx, invitation.org_id);
    if (!organization) {
      throw new APIException('invalid_request', '组织不存在');
    }

    const client = await this.clientRepository.retrieve(ctx, invitation.client_id);
    if (!client) {
      throw new APIException('invalid_request', 'client not found');
    }

    if (!client.initiate_login_uri) {
      throw new APIException('invalid_request', '对应的 应用 必须设置初始登录链接');
    }

    const ticket = nanoid(36);
    const url = new URL(client.initiate_login_uri);
    url.searchParams.set('invitation', ticket);
    url.searchParams.set('organization', invitation.org_id);
    url.searchParams.set('organization_name', organization.display_name);
    return await this.invitationRepository.createOne(ctx, { ...invitation, tenant: ctx.tenant, ticket, invitation_url: url.href });
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    this.invitationRepository.deleteOne(ctx, id);
  }

  async update(
    ctx: IContext,
    id: string,
    body: Partial<InvitationDto>,
  ): Promise<InvitationDto> {
    return await this.invitationRepository.updateOne(ctx, id, body);
  }

  async paginate(
    ctx: IContext,
    query: PageQueryDto,
  ): Promise<Page<InvitationDto>> {
    return await this.invitationRepository.paginate(ctx, query);
  }
}
