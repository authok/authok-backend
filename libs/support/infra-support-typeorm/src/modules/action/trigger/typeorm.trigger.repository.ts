import { IContext } from '@libs/nest-core';
import { TriggerModel, ITriggerRepository } from 'libs/api/infra-api/src';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { TriggerEntity } from './trigger.entity';
import { Inject } from '@nestjs/common';
import { TriggerMapper } from './trigger.mapper';
import { ActionMapper } from '../action/action.mapper';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { Page, PageQuery } from 'libs/common/src/pagination';

export class TypeOrmTriggerRepository
  extends TenantAwareRepository
  implements ITriggerRepository
{
  @Inject()
  private actionMapper: ActionMapper;

  @Inject()
  private triggerMapper: TriggerMapper;

  async create(ctx: IContext, trigger: TriggerModel): Promise<TriggerModel> {
    const triggerRepo = await this.repo(ctx, TriggerEntity);

    const entity = this.triggerMapper.toEntity(trigger);
    entity.tenant = ctx.tenant;

    const saved = await triggerRepo.save(entity);
    return this.triggerMapper.toDTO(saved);
  }

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<TriggerModel | undefined> {
    const triggerRepo = await this.repo(ctx, TriggerEntity);
    const entity = await triggerRepo.findOne({
      where: {
        tenant: ctx.tenant,
        id,
      }
    });

    return this.triggerMapper.toDTO(entity);
  }

  async update(ctx: IContext, trigger: TriggerModel): Promise<TriggerModel> {
    const triggerRepo = await this.repo(ctx, TriggerEntity);

    await triggerRepo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        id: trigger.id,
      }
    });

    const entity = this.triggerMapper.toEntity(trigger);

    const saved = await triggerRepo.save(entity);
    return this.triggerMapper.toDTO(saved);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    const triggerRepo = await this.repo(ctx, TriggerEntity);
    const entity = await triggerRepo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        id: id,
      }
    });

    await entity.remove();
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<TriggerModel>> {
    const triggerRepo = await this.repo(ctx, TriggerEntity);

    query.tenant = ctx.tenant;
    const page = await paginate(triggerRepo, query, []);
    return {
      meta: page.meta,
      items: page.items.map(this.triggerMapper.toDTO),
    };
  }
}
