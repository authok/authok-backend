import { ClientDto, CreateClientDto, UpdateClientDto } from './client.dto';
import { IContext } from '@libs/nest-core';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { ConnectionDto } from '../connection/connection.dto';

export interface IClientService {
  findByName(ctx: IContext, name: string): Promise<ClientDto | null>;

  retrieve(ctx: IContext, id: string): Promise<ClientDto | null>;

  create(
    ctx: IContext,
    input: Partial<CreateClientDto>,
  ): Promise<ClientDto | null>;

  update(
    ctx: IContext,
    id: string,
    input: Partial<UpdateClientDto>,
  ): Promise<ClientDto | null>;

  delete(ctx: IContext, id: string): Promise<void>;

  rotate(ctx: IContext, id: string): Promise<ClientDto>;

  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<ClientDto>>;

  findEnabledConnections(
    ctx: IContext,
    client_id: string,
  ): Promise<ConnectionDto[]>;
}
