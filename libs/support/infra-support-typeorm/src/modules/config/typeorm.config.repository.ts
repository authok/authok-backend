import { Injectable } from '@nestjs/common';

import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { IConfigRepository } from 'libs/api/infra-api/src/config/config.repository';
import { IRequestContext } from '@libs/nest-core';
import { ConfigEntity } from './config.entity';
import { Config } from 'libs/api/infra-api/src/config/config.model';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';
import { APIException } from 'libs/common/src/exception/api.exception';

@Injectable()
export class TypeOrmConfigRepository
  extends TenantAwareRepository
  implements IConfigRepository {
  async get(
    ctx: IRequestContext,
    namespace: string,
    name: string,
  ): Promise<Config | undefined> {
    const repo = await this.repo(ctx, ConfigEntity);

    return await repo.findOne({
      tenant: ctx.tenant,
      namespace,
      name,
    });
  }

  async set(
    ctx: IRequestContext,
    namespace: string,
    name: string,
    data: Partial<Config>,
  ): Promise<Config> {
    const repo = await this.repo(ctx, ConfigEntity);

    const entity = repo.create({...data, tenant: ctx.tenant, namespace, name});

    return await repo.save(entity);
  }

  async delete(ctx: IRequestContext, namespace: string, name: string): Promise<void> {
    const repo = await this.repo(ctx, ConfigEntity);

    const config = await repo.findOneOrFail({
      tenant: ctx.tenant,
      namespace,
      name,
    })
  
    await repo.remove(config);
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQuery,
  ): Promise<Page<Config>> {
    const repo = await this.repo(ctx, ConfigEntity);

    query.tenant = ctx.tenant;

    return await paginate<ConfigEntity>(repo, query, [
      'name',
      'namespace',
    ]);
  }
}
