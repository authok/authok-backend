import { ClientDto, CreateClientDto, UpdateClientDto } from './client.dto';
import { IRequestContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { ConnectionDto } from '../connection/connection.dto';

export interface IClientRepository {
  findByName(
    ctx: IRequestContext,
    name: string,
  ): Promise<ClientDto | undefined>;

  retrieve(ctx: IRequestContext, id: string): Promise<ClientDto | undefined>;

  create(
    ctx: IRequestContext,
    client: ClientDto,
  ): Promise<ClientDto | undefined>;

  update(
    ctx: IRequestContext,
    id: string,
    input: Partial<UpdateClientDto>,
  ): Promise<ClientDto | null>;

  delete(ctx: IRequestContext, id: string);

  paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<ClientDto>>;

  findEnabledConnections(
    ctx: IRequestContext,
    client_id: string,
  ): Promise<ConnectionDto[]>;
}
