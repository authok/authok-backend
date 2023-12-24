import { Injectable, Inject } from '@nestjs/common';
import { IRequestContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { IGrantRepository } from 'libs/api/infra-api/src/grant/grant.repository';
import { GrantEntity } from './grant.entity';
import { GrantDto } from 'libs/api/infra-api/src/grant/grant.dto';
import { GrantMapper } from './grant.mapper';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';

@Injectable()
export class TypeOrmGrantRepository
  extends TenantAwareRepository
  implements IGrantRepository
{
  @Inject()
  private readonly grantMapper: GrantMapper;

  async update(
    ctx: IRequestContext,
    grant: Partial<GrantDto>,
  ): Promise<GrantDto> {
    const repo = await this.repo(ctx, GrantEntity);

    await repo.findOneOrFail({
      tenant: ctx.tenant,
      id: grant.id,
    });

    const entity = this.grantMapper.toEntity(ctx, grant);

    const saved = await repo.save(entity);
    return this.grantMapper.toDTO(saved);
  }

  async create(
    ctx: IRequestContext,
    grant: Partial<GrantDto>,
  ): Promise<GrantDto> {
    const repo = await this.repo(ctx, GrantEntity);

    const entity = this.grantMapper.toEntity(ctx, grant);

    const saved = await repo.save(entity);
    return this.grantMapper.toDTO(saved);
  }

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<GrantDto | undefined> {
    const repo = await this.repo(ctx, GrantEntity);

    const entity = await repo.findOne({
      tenant: ctx.tenant,
      id,
    });

    return this.grantMapper.toDTO(entity);
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    const repo = await this.repo(ctx, GrantEntity);

    const entity = await repo.findOne({
      tenant: ctx.tenant,
      id,
    });
    if (!entity) return;

    await repo.remove(entity);
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<GrantDto>> {
    const repo = await this.repo(ctx, GrantEntity);

    query.tenant = ctx.tenant;
    const page = await paginate(repo, query, ['user_id', 'client_id']);

    return {
      items: page.items.map(this.grantMapper.toDTO),
      meta: page.meta,
    };
  }

  async deleteByUserId(ctx: IRequestContext, user_id: string): Promise<void> {
    const repo = await this.repo(ctx, GrantEntity);
    const entity = await repo.findOne({
      user: {
        tenant: ctx.tenant,
        user_id,
      },
    });
    if (!entity) return;

    await repo.remove(entity);
  }
}
