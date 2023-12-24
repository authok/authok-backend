import { IRequestContext, QueryRepository } from '@libs/nest-core';
import { InvitationDto } from './invitation.dto';
import { PageQueryDto, PageDto } from 'libs/common/src/pagination/pagination.dto';

export interface IInvitationRepository extends QueryRepository<InvitationDto> {
  findByTicket(
    ctx: IRequestContext,
    ticket: string,
  ): Promise<InvitationDto | undefined>;

  paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<InvitationDto>>;
}