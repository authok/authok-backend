import { ClientDto, CreateClientDto, UpdateClientDto } from './client.dto';
import { IContext } from '@libs/nest-core';
import { ConnectionModel } from '../connection/connection.model';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export interface IClientRepository {
  findByName(
    ctx: IContext,
    name: string,
  ): Promise<ClientDto | undefined>;

  retrieve(ctx: IContext, id: string): Promise<ClientDto | undefined>;

  create(
    ctx: IContext,
    client: ClientDto,
  ): Promise<ClientDto | undefined>;

  update(
    ctx: IContext,
    id: string,
    input: Partial<UpdateClientDto>,
  ): Promise<ClientDto | null>;

  delete(ctx: IContext, id: string);

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<ClientDto>>;

  findEnabledConnections(
    ctx: IContext,
    client_id: string,
  ): Promise<ConnectionModel[]>;
}
