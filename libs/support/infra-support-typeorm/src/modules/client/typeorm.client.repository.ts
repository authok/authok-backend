import { Inject, Injectable } from '@nestjs/common';

import { ClientEntity } from './client.entity';
import { 
  ClientModel,
  UpdateClientModel,
  IClientRepository,
  ConnectionModel,
} from 'libs/api/infra-api/src';
import { plainToClass } from 'class-transformer';
import { IContext } from '@libs/nest-core';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { ConnectionEntity } from '../connection/connection.entity';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { ClientMapper } from './client.mapper';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class TypeOrmClientRepository
  extends TenantAwareRepository
  implements IClientRepository
{
  @Inject()
  private readonly clientMapper: ClientMapper;

  async retrieve(
    ctx: IContext,
    client_id: string,
  ): Promise<ClientModel | undefined> {
    const repo = await this.repo(ctx, ClientEntity);
    const entity = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        client_id,
      }
    });
    if (!entity) return undefined;

    return this.clientMapper.toDTO(entity);
  }

  async findByName(ctx: IContext, name: string): Promise<ClientModel | null> {
    const repo = await this.repo(ctx, ClientEntity);
    const entity = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        name,
      },
    });

    if (!entity) return undefined;

    return this.clientMapper.toDTO(entity);
  }

  async create(ctx: IContext, _client: ClientModel): Promise<ClientModel> {
    const repo = await this.repo(ctx, ClientEntity);
    const entity = await repo.save(
      plainToClass(ClientEntity, { ..._client, tenant: ctx.tenant }),
    );

    return this.clientMapper.toDTO(entity);
  }

  async delete(ctx: IContext, client_id: string): Promise<void> {
    const repo = await this.repo(ctx, ClientEntity);
    // await repo.softDelete(id);

    const client = await repo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        client_id,
      }
    });

    await repo.remove(client);
  }

  async update(
    ctx: IContext,
    id: string,
    body: Partial<UpdateClientModel>,
  ): Promise<ClientModel> {
    const repo = await this.repo(ctx, ClientEntity);

    const client = plainToClass(ClientEntity, body);
    const { affected } = await repo.update(id, client);

    console.log('nimbi: ', affected, id, await repo.findOne({ where: { client_id: id }}));

    const entity = await repo.findOneOrFail({
      where: { client_id: id }
    });
    return this.clientMapper.toDTO(entity);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<ClientModel>> {
    const repo = await this.repo(ctx, ClientEntity);
    const connection = await this.connection(ctx);
    const fields = await connection
      .getMetadata(ClientEntity)
      .columns.map((it) => it.propertyName);

    query.tenant = ctx.tenant;

    const page = await paginate<ClientEntity>(repo, query, fields);
    return {
      meta: page.meta,
      items: page.items.map((it) => this.clientMapper.toDTO(it)),
    };
  }

  /**
   * 这个函数应该移到 connection 中，用通用的 query 方法
   * @param ctx
   * @param client_id
   * @returns
   */
  async findEnabledConnections(
    ctx: IContext,
    client_id: string,
  ): Promise<ConnectionModel[]> {
    const connectionRepo = await this.repo(ctx, ConnectionEntity);
    const connections = await connectionRepo
      .createQueryBuilder('connections')
      .leftJoin(
        'client_connections',
        'client_connections',
        'client_connections.connection_id = connections.id',
      )
      .where(
        'connections.tenant = :tenant AND client_connections.client_id = :client_id',
        {
          tenant: ctx.tenant,
          client_id,
        },
      )
      .getMany();

    return connections?.map((it) => ({
      ...it,
      ...(it.enabled_clients
        ? { enabled_clients: it.enabled_clients.map((it) => it.client_id) }
        : undefined),
    }));
  }
}
