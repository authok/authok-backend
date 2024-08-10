import { Injectable, Inject } from '@nestjs/common';
import { IContext, IRequestContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { 
  IGrantRepository,
  GrantModel,
} from 'libs/api/infra-api/src';
import { GrantEntity } from './grant.entity';
import { GrantMapper } from './grant.mapper';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

@Injectable()
export class TypeOrmGrantRepository
  extends TenantAwareRepository
  implements IGrantRepository
{
  @Inject()
  private readonly grantMapper: GrantMapper;

  async update(
    ctx: IContext,
    grant: Partial<GrantModel>,
  ): Promise<GrantModel> {
    const repo = await this.repo(ctx, GrantEntity);

    await repo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        id: grant.id,
      }
    });

    const entity = this.grantMapper.toEntity(ctx, grant);

    const saved = await repo.save(entity);
    return this.grantMapper.toDTO(saved);
  }

  async create(
    ctx: IContext,
    grant: Partial<GrantModel>,
  ): Promise<GrantModel> {
    const repo = await this.repo(ctx, GrantEntity);

    const entity = this.grantMapper.toEntity(ctx, grant);

    const saved = await repo.save(entity);
    return this.grantMapper.toDTO(saved);
  }

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<GrantModel | undefined> {
    const repo = await this.repo(ctx, GrantEntity);

    const entity = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        id,
      }
    });

    return this.grantMapper.toDTO(entity);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    const repo = await this.repo(ctx, GrantEntity);

    const entity = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        id,
      }
    });
    if (!entity) return;

    await repo.remove(entity);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<GrantModel>> {
    const repo = await this.repo(ctx, GrantEntity);

    query.tenant = ctx.tenant;
    const page = await paginate(repo, query, ['user_id', 'client_id']);

    return {
      items: page.items.map(this.grantMapper.toDTO),
      meta: page.meta,
    };
  }

  async deleteByUserId(ctx: IContext, user_id: string): Promise<void> {
    const repo = await this.repo(ctx, GrantEntity);
    const entity = await repo.findOne({
      where: {
        user: {
          tenant: ctx.tenant,
          user_id,
        },
      }
    });
    if (!entity) return;

    await repo.remove(entity);
  }
}
