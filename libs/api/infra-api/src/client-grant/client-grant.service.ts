import { IContext } from '@libs/nest-core';
import { ClientGrantPageQuery, ClientGrantModel } from './client-grant.model';
import { Page } from 'libs/common/src/pagination/pagination.model';

export interface IClientGrantService {
  retrieve(
    ctx: IContext,
    id: string,
  ): Promise<ClientGrantModel | undefined>;

  findByClientAndAudience(
    ctx: IContext,
    client_id: string,
    audience: string,
  ): Promise<ClientGrantModel | undefined>;

  update(
    ctx: IContext,
    id: string,
    data: Partial<ClientGrantModel>,
  ): Promise<ClientGrantModel>;

  delete(ctx: IContext, id: string): Promise<void>;

  create(
    ctx: IContext,
    clientGrant: Partial<ClientGrantModel>,
  ): Promise<ClientGrantModel>;

  paginate(
    ctx: IContext,
    query: ClientGrantPageQuery,
  ): Promise<Page<ClientGrantModel>>;
}
