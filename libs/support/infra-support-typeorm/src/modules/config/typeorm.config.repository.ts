import { Injectable } from '@nestjs/common';

import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { 
  IConfigRepository,
  ConfigModel,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { ConfigEntity } from './config.entity';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class TypeOrmConfigRepository
  extends TenantAwareRepository
  implements IConfigRepository {
  async get(
    ctx: IContext,
    namespace: string,
    name: string,
  ): Promise<ConfigModel | undefined> {
    const repo = await this.repo(ctx, ConfigEntity);

    return await repo.findOne({
      where: {
        tenant: ctx.tenant,
        namespace,
        name,
      }
    });
  }

  async set(
    ctx: IContext,
    namespace: string,
    name: string,
    data: Partial<ConfigModel>,
  ): Promise<ConfigModel> {
    const repo = await this.repo(ctx, ConfigEntity);

    const entity = repo.create({...data, tenant: ctx.tenant, namespace, name});

    return await repo.save(entity);
  }

  async delete(ctx: IContext, namespace: string, name: string): Promise<void> {
    const repo = await this.repo(ctx, ConfigEntity);

    const config = await repo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        namespace,
        name,
      }
    })
  
    await repo.remove(config);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<ConfigModel>> {
    const repo = await this.repo(ctx, ConfigEntity);

    query.tenant = ctx.tenant;

    return await paginate<ConfigEntity>(repo, query, [
      'name',
      'namespace',
    ]);
  }
}