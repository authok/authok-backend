import { Inject, Injectable } from '@nestjs/common';

import { ResourceServerEntity } from './resource-server.entity';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { ResourceServerMapper } from './resource-server.mapper';
import * as _ from 'lodash';
import {
  ResourceServerModel,
  CreateResourceServerModel,
  UpdateResourceServerModel,
  IResourceServerRepository,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

@Injectable()
export class TypeOrmResourceServerRepository
  extends TenantAwareRepository
  implements IResourceServerRepository
{
  @Inject()
  private readonly resourceServerMapper: ResourceServerMapper;

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<ResourceServerModel | undefined> {
    const resourceServerRepo = await this.repo(ctx, ResourceServerEntity);

    const resourceServer = await resourceServerRepo
      .createQueryBuilder()
      .leftJoinAndSelect('ResourceServerEntity.permissions', 'permissions')
      .where({
        tenant: ctx.tenant,
        id: id,
      })
      .orderBy('permissions.created_at', 'DESC')
      .getOne();

    return this.resourceServerMapper.toDTO(resourceServer);
  }

  async findByIdentifier(
    ctx: IContext,
    identifier: string,
  ): Promise<ResourceServerModel | undefined> {
    const resourceServerRepo = await this.repo(ctx, ResourceServerEntity);

    const resourceServer = await resourceServerRepo.findOne({
      where: {
        tenant: ctx.tenant,
        identifier,
      },
    });

    return this.resourceServerMapper.toDTO(resourceServer ?? undefined);
  }

  async create(
    ctx: IContext,
    _resourceServer: Partial<CreateResourceServerModel>,
  ): Promise<ResourceServerModel> {
    const resourceServerRepo = await this.repo(ctx, ResourceServerEntity);

    const resourceServer = this.resourceServerMapper.toEntity(
      ctx,
      _resourceServer,
    );
    const savedResourceServer = await resourceServerRepo.save(resourceServer!);

    return this.resourceServerMapper.toDTO(savedResourceServer)!;
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    const apiRepository = await this.repo(ctx, ResourceServerEntity);

    const api = await apiRepository.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        id,
      }
    });

    await apiRepository.remove(api);
  }

  async update(
    ctx: IContext,
    id: string,
    _data: UpdateResourceServerModel,
  ): Promise<ResourceServerModel> {
    const resourceServerRepo = await this.repo(ctx, ResourceServerEntity);

    const existingResourceServer = await resourceServerRepo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        id,
      }
    });

    const data = this.resourceServerMapper.toEntity(ctx, _data);
    data.id = existingResourceServer.id;

    if (data.permissions) {
      const name2perm = _.keyBy(
        existingResourceServer.permissions || [],
        'name',
      );

      data.permissions.forEach((perm) => {
        const existingPerm = name2perm[perm.name];
        if (existingPerm) {
          perm.id = existingPerm.id;
        }
      });
    }

    const savedResourceServer = await resourceServerRepo.save(data);
    return this.resourceServerMapper.toDTO(savedResourceServer);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<ResourceServerModel>> {
    const resourceServerRepo = await this.repo(ctx, ResourceServerEntity);

    query.tenant = ctx.tenant;
    const result = await paginate<ResourceServerEntity>(
      resourceServerRepo,
      query,
      ['tenant', 'name', 'is_system', 'id', 'identifier', 'enforce_policies'],
    );

    return {
      items: result.items.map((api) => this.resourceServerMapper.toDTO(api)),
      meta: result.meta,
    };
  }
}
