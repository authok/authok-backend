import { ClientModel, CreateClientModel, UpdateClientModel } from './client.model';
import { IContext } from '@libs/nest-core';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { ConnectionModel } from '../connection/connection.model';

export interface IClientService {
  findByName(ctx: IContext, name: string): Promise<ClientModel | null>;

  retrieve(ctx: IContext, id: string): Promise<ClientModel | null>;

  create(
    ctx: IContext,
    input: Partial<CreateClientModel>,
  ): Promise<ClientModel | null>;

  update(
    ctx: IContext,
    id: string,
    input: Partial<UpdateClientModel>,
  ): Promise<ClientModel | null>;

  delete(ctx: IContext, id: string): Promise<void>;

  rotate(ctx: IContext, id: string): Promise<ClientModel>;

  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<ClientModel>>;

  findEnabledConnections(
    ctx: IContext,
    client_id: string,
  ): Promise<ConnectionModel[]>;
}
