import { Injectable, Inject } from '@nestjs/common';
import { IContext, IRequestContext, ReqCtx } from '@libs/nest-core';
import { In } from 'typeorm';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { PermissionEntity } from '../permission/permission.entity';
import { ClientGrantEntity } from './client-grant.entity';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { 
  IClientGrantRepository,
  ClientGrantModel, 
  ClientGrantPageQuery,
} from 'libs/api/infra-api/src';
import { Page } from 'libs/common/src/pagination';
import { ClientGrantMapper } from './client-grant.mapper';
import * as _ from 'lodash';

@Injectable()
export class TypeOrmClientGrantRepository
  extends TenantAwareRepository
  implements IClientGrantRepository
{
  @Inject() private readonly clientGrantMapper: ClientGrantMapper;

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<ClientGrantModel | undefined> {
    const repo = await this.repo(ctx, ClientGrantEntity);
    const clientGrant = await repo.findOne({
      where: {
        id,
        tenant: ctx.tenant,
      },
    });

    return this.clientGrantMapper.toDTO(clientGrant);
  }

  async findByClientAndAudience(
    ctx: IRequestContext,
    client_id: string,
    audience: string,
  ): Promise<ClientGrantModel | undefined> {
    const repo = await this.repo(ctx, ClientGrantEntity);
    const clientGrant = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        client_id,
        audience,
      },
    });

    return this.clientGrantMapper.toDTO(clientGrant);
  }

  async update(
    ctx: IRequestContext,
    id: string,
    _data: Partial<ClientGrantModel>,
  ): Promise<ClientGrantModel> {
    const repo = await this.repo(ctx, ClientGrantEntity);
    const permissionRepo = await this.repo(ctx, PermissionEntity);
    const existingClientGrant = await repo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        id,
      }
    });

    const data = this.clientGrantMapper.toEntity(_data);
    if (data.resource_server) {
      data.resource_server.tenant = ctx.tenant;
    }

    if (_data.scope) {
      const permissions = await permissionRepo.find({
        where: {
          resource_server: {
            tenant: ctx.tenant,
            identifier: existingClientGrant.audience,
          },
          name: In(_data.scope),
        },
        select: ['name', 'id'],
        relations: ['resource_server'],
      });

      const name2perm = _.keyBy(permissions, 'name');

      const validPermission = [];
      data.permissions.forEach((perm) => {
        const existingPerm = name2perm[perm.name];
        if (existingPerm) {
          perm.id = existingPerm.id;
          validPermission.push(perm);
        }
      });
      data.permissions = validPermission;
    }
    data.id = existingClientGrant.id;

    console.log('toUpdate: ', data);

    const r = await repo.save(data);
    return this.clientGrantMapper.toDTO(r);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    const repo = await this.repo(ctx, ClientGrantEntity);
    await repo.delete({
      id,
      tenant: ctx.tenant,
    });
  }

  async create(
    ctx: IContext,
    _clientGrant: ClientGrantModel,
  ): Promise<ClientGrantModel> {
    const repo = await this.repo(ctx, ClientGrantEntity);
    const permissionRepo = await this.repo(ctx, PermissionEntity);

    const clientGrant = this.clientGrantMapper.toEntity(_clientGrant);
    if (clientGrant.resource_server) {
      clientGrant.resource_server.tenant = ctx.tenant;
    }
    clientGrant.tenant = ctx.tenant;

    if (_clientGrant.scope) {
      const permissions = await permissionRepo.find({
        where: {
          resource_server: {
            tenant: ctx.tenant,
            identifier: _clientGrant.audience,
          },
          name: In(_clientGrant.scope),
        },
        select: ['name', 'id'],
        relations: ['resource_server'],
      });

      const name2perm = _.keyBy(permissions, 'name');

      const validPermission = [];
      clientGrant.permissions.forEach((perm) => {
        const existingPerm = name2perm[perm.name];
        if (existingPerm) {
          perm.id = existingPerm.id;
          validPermission.push(perm);
        }
      });

      clientGrant.permissions = validPermission;
    }

    const saved = await repo.save(clientGrant);

    return this.clientGrantMapper.toDTO(saved);
  }

  async paginate(
    @ReqCtx() ctx: IContext,
    query: ClientGrantPageQuery,
  ): Promise<Page<ClientGrantModel>> {
    const repo = await this.repo(ctx, ClientGrantEntity);

    query.tenant = ctx.tenant;
    const page = await paginate<ClientGrantEntity>(repo, query, [
      'audience',
      'client_id',
    ]);

    return {
      items: page.items.map(this.clientGrantMapper.toDTO),
      meta: page.meta,
    };
  }
}
