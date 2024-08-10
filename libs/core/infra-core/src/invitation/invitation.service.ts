import { Injectable, Inject } from '@nestjs/common';

import { 
  IInvitationService,
  IInvitationRepository,
  IClientRepository,
  IOrganizationRepository,
  InvitationModel,
  UserModel,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination';
import { APIException } from 'libs/common/src/exception/api.exception';
import { URL } from 'url';
import { nanoid } from 'nanoid';

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
    ctx: IContext,
    id: string,
  ): Promise<InvitationModel | undefined> {
    const invitation = await this.invitationRepository.getById(ctx, id);
    if (!invitation) return undefined;

    const inviter = await this.invitationRepository.findRelation(
      ctx,
      UserModel,
      'inviter',
      invitation,
    );

    invitation.inviter = inviter;

    return invitation;
  }

  async findByTicket(
    ctx: IContext,
    ticket: string,
  ): Promise<InvitationModel | undefined> {
    return await this.invitationRepository.findByTicket(ctx, ticket);
  }

  async create(
    ctx: IContext,
    invitation: InvitationModel,
  ): Promise<InvitationModel> {
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

  async delete(ctx: IContext, id: string): Promise<void> {
    this.invitationRepository.deleteOne(ctx, id);
  }

  async update(
    ctx: IContext,
    id: string,
    body: Partial<InvitationModel>,
  ): Promise<InvitationModel> {
    return await this.invitationRepository.updateOne(ctx, id, body);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<InvitationModel>> {
    return await this.invitationRepository.paginate(ctx, query);
  }
}