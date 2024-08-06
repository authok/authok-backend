import { IContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';
import { InvitationModel } from './invitation.model';

export interface IInvitationService {
  retrieve(
    ctx: IContext,
    id: string,
  ): Promise<InvitationModel | undefined>;

  findByTicket(
    ctx: IContext,
    token: string,
  ): Promise<InvitationModel | undefined>;

  update(
    ctx: IContext,
    id: string,
    body: Partial<InvitationModel>,
  ): Promise<InvitationModel>;

  delete(ctx: IContext, id: string): Promise<void>;

  create(
    ctx: IContext,
    body: InvitationModel,
  ): Promise<InvitationModel>;

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<InvitationModel>>;
}
