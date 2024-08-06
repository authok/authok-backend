import { ClientModel, CreateClientModel, UpdateClientModel } from './client.model';
import { IContext } from '@libs/nest-core';
import { ConnectionModel } from '../connection/connection.model';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export interface IClientRepository {
  findByName(
    ctx: IContext,
    name: string,
  ): Promise<ClientModel | undefined>;

  retrieve(ctx: IContext, id: string): Promise<ClientModel | undefined>;

  create(
    ctx: IContext,
    client: ClientModel,
  ): Promise<ClientModel | undefined>;

  update(
    ctx: IContext,
    id: string,
    input: Partial<UpdateClientModel>,
  ): Promise<ClientModel | null>;

  delete(ctx: IContext, id: string);

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<ClientModel>>;

  findEnabledConnections(
    ctx: IContext,
    client_id: string,
  ): Promise<ConnectionModel[]>;
}
