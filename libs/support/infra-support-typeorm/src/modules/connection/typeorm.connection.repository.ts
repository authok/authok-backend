import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ConnectionEntity } from './connection.entity';

import {
  ConnectionModel,
  CreateConnectionModel,
  UpdateConnectionModel,
  IConnectionRepository,
} from 'libs/api/infra-api/src';
import { IContext, IRequestContext } from '@libs/nest-core';
import { plainToClass } from 'class-transformer';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { ClientEntity } from '../client/client.entity';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import deepmerge from 'deepmerge';
import { ConnectionMapper } from './connection.mapper';
import { APIException } from 'libs/common/src/exception/api.exception';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

@Injectable()
export class TypeOrmConnectionRepository
  extends TenantAwareRepository
  implements IConnectionRepository
{
  @Inject()
  private readonly connectionMapper: ConnectionMapper;

  async findByName(
    ctx: IContext,
    name: string,
  ): Promise<ConnectionModel | undefined> {
    const connectionRepository = await this.repo(ctx, ConnectionEntity);
    const connection = await connectionRepository.findOne({
      where: { tenant: ctx.tenant, name },
    });
    if (!connection) return null;

    return {
      ...connection,
      ...(connection.enabled_clients
        ? {
            enabled_clients: connection.enabled_clients.map(
              (it) => it.client_id,
            ),
          }
        : undefined),
    };
  }

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<ConnectionModel | null> {
    const connectionRepository = await this.repo(ctx, ConnectionEntity);
    const connection = await connectionRepository.findOne({
      where: {
        tenant: ctx.tenant,
        id,
      },
    });
    if (!connection) return null;

    return {
      ...connection,
      ...(connection.enabled_clients
        ? {
            enabled_clients: connection.enabled_clients.map(
              (it) => it.client_id,
            ),
          }
        : undefined),
    };
  }

  async create(
    ctx: IRequestContext,
    input: CreateConnectionModel,
  ): Promise<ConnectionModel> {
    const connectionRepository = await this.repo(ctx, ConnectionEntity);

    const existConnection = await connectionRepository.findOne({
      where: {
        tenant: ctx.tenant,
        name: input.name,
      }
    });

    if (existConnection) {
      throw new APIException('invalid_request', `Connection with identity "${input.name}" already exists`);
    }

    const connection = await connectionRepository.save(
      plainToClass(ConnectionEntity, {
        ...input,
        tenant: ctx.tenant,
      }),
    );

    return {
      ...connection,
      ...(connection.enabled_clients
        ? {
            enabled_clients: connection.enabled_clients.map(
              (it) => it.client_id,
            ),
          }
        : undefined),
    };
  }

  async delete(
    ctx: IContext,
    id: string,
  ): Promise<{ affected?: number }> {
    const connectionRepository = await this.repo(ctx, ConnectionEntity);
    return await connectionRepository.delete({
      tenant: ctx.tenant,
      id,
    });
  }

  async update(
    ctx: IContext,
    id: string,
    data: UpdateConnectionModel,
  ): Promise<void> {
    const connectionRepo = await this.repo(ctx, ConnectionEntity);
    const clientRepo = await this.repo(ctx, ClientEntity);

    const existingConn = await connectionRepo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        id,
      },
    });

    if (data.options) {
      data.options = deepmerge(existingConn.options, data.options);
      console.log('merged: ', data.options);
    }

    const { enabled_clients: client_ids, ...rest } = data;

    const entity = plainToClass(ConnectionEntity, {
      ...rest,
      tenant: ctx.tenant,
      id,
    });

    if (client_ids) {
      const enabled_clients = await clientRepo.findByIds(client_ids);
      if (enabled_clients) {
        client_ids.forEach((client_id) => {
          const find = enabled_clients.filter(
            (it) => it.client_id == client_id,
          );
          if (find.length == 0)
            throw new NotFoundException(`Client ${client_id} not found`);
        });
        entity.enabled_clients = enabled_clients;
      }
    }

    await connectionRepo.save(entity);
  }

  async paginate(
    ctx: IContext,
    _query: PageQuery,
  ): Promise<Page<ConnectionModel>> {
    const connectionRepository = await this.repo(ctx, ConnectionEntity);

    const query = {
      ..._query,
      sort: '-created_at',
      tenant: ctx.tenant,
    };

    const result = await paginate<ConnectionEntity>(
      connectionRepository,
      query,
      ['tenant', 'strategy', 'name'],
    );

    return {
      items: result.items.map(this.connectionMapper.toDTO),
      meta: result.meta,
    };
  }
}
