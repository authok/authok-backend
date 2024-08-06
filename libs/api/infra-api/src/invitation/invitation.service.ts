import { IContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';
import { InvitationDto } from './invitation.dto';

export interface IInvitationService {
  retrieve(
    ctx: IContext,
    id: string,
  ): Promise<InvitationDto | undefined>;

  findByTicket(
    ctx: IContext,
    token: string,
  ): Promise<InvitationDto | undefined>;

  update(
    ctx: IContext,
    id: string,
    body: Partial<InvitationDto>,
  ): Promise<InvitationDto>;

  delete(ctx: IContext, id: string): Promise<void>;

  create(
    ctx: IContext,
    body: InvitationDto,
  ): Promise<InvitationDto>;

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<InvitationDto>>;
}
