import { IContext, QueryRepository } from '@libs/nest-core';
import { InvitationModel } from './invitation.model';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export interface IInvitationRepository extends QueryRepository<InvitationModel> {
  findByTicket(
    ctx: IContext,
    ticket: string,
  ): Promise<InvitationModel | undefined>;

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<InvitationModel>>;
}