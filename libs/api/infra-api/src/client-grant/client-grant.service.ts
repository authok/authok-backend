import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';
import { ClientGrantDto } from './client-grant.dto';
import { Page } from 'libs/common/src/pagination/pagination.model';
import { ClientGrantPageQuery } from './client-grant.model';

export interface IClientGrantService {
  retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<ClientGrantDto | undefined>;

  findByClientAndAudience(
    ctx: IRequestContext,
    client_id: string,
    audience: string,
  ): Promise<ClientGrantDto | undefined>;

  update(
    ctx: IRequestContext,
    id: string,
    data: Partial<ClientGrantDto>,
  ): Promise<ClientGrantDto>;

  delete(ctx: IRequestContext, id: string): Promise<void>;

  create(
    ctx: IRequestContext,
    clientGrant: Partial<ClientGrantDto>,
  ): Promise<ClientGrantDto>;

  paginate(
    ctx: IRequestContext,
    query: ClientGrantPageQuery,
  ): Promise<Page<ClientGrantDto>>;
}
