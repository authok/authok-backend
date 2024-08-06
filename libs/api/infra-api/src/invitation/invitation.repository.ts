import { IContext, QueryRepository } from '@libs/nest-core';
import { InvitationModel } from './invitation.model';
import { PageQueryDto, PageDto } from 'libs/common/src/pagination/pagination.dto';

export interface IInvitationRepository extends QueryRepository<InvitationModel> {
  findByTicket(
    ctx: IContext,
    ticket: string,
  ): Promise<InvitationModel | undefined>;

  paginate(
    ctx: IContext,
    query: PageQueryDto,
  ): Promise<PageDto<InvitationModel>>;
}