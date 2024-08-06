import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ConnectionEntity } from './connection.entity';

import {
  ConnectionDto,
  CreateConnectionDto,
  UpdateConnectionDto,
} from 'libs/api/infra-api/src/connection/connection.dto';
import { IConnectionRepository } from 'libs/api/infra-api/src/connection/connection.repository';
import { IRequestContext } from '@libs/nest-core';
import { plainToClass } from 'class-transformer';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { ClientEntity } from '../client/client.entity';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import deepmerge from 'deepmerge';
import { ConnectionMapper } from './connection.mapper';
import { APIException } from 'libs/common/src/exception/api.exception';

@Injectable()
export class TypeOrmConnectionRepository
  extends TenantAwareRepository
  implements IConnectionRepository
{
  @Inject()
  private readonly connectionMapper: ConnectionMapper;

  async findByName(
    ctx: IRequestContext,
    name: string,
  ): Promise<ConnectionDto | undefined> {
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
  ): Promise<ConnectionDto | null> {
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
    input: CreateConnectionDto,
  ): Promise<ConnectionDto> {
    const connectionRepository = await this.repo(ctx, ConnectionEntity);

    const existConnection = await connectionRepository.findOne({
      where: {
        tenant: ctx.tenant,
        name: input.name,
      }
    });

    if (existConnection) {
      throw new APIException('invalid_request', '已经存在相同标识的连接');
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
    ctx: IRequestContext,
    id: string,
  ): Promise<{ affected?: number }> {
    const connectionRepository = await this.repo(ctx, ConnectionEntity);
    return await connectionRepository.delete({
      tenant: ctx.tenant,
      id,
    });
  }

  async update(
    ctx: IRequestContext,
    id: string,
    data: UpdateConnectionDto,
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
    ctx: IRequestContext,
    _query: PageQueryDto,
  ): Promise<PageDto<ConnectionDto>> {
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
