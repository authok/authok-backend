import { IRequestContext } from '@libs/nest-core';
import { ITriggerRepository } from 'libs/api/infra-api/src/action/trigger/trigger.repository';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { TriggerDto } from 'libs/api/infra-api/src/action/trigger/trigger.dto';
import { TriggerEntity } from './trigger.entity';
import { Inject } from '@nestjs/common';
import { TriggerMapper } from './trigger.mapper';
import { ActionMapper } from '../action/action.mapper';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';

export class TypeOrmTriggerRepository
  extends TenantAwareRepository
  implements ITriggerRepository
{
  @Inject()
  private actionMapper: ActionMapper;

  @Inject()
  private triggerMapper: TriggerMapper;

  async create(ctx: IRequestContext, trigger: TriggerDto): Promise<TriggerDto> {
    const triggerRepo = await this.repo(ctx, TriggerEntity);

    const entity = this.triggerMapper.toEntity(trigger);
    entity.tenant = ctx.tenant;

    const saved = await triggerRepo.save(entity);
    return this.triggerMapper.toDTO(saved);
  }

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<TriggerDto | undefined> {
    const triggerRepo = await this.repo(ctx, TriggerEntity);
    const entity = await triggerRepo.findOne({
      tenant: ctx.tenant,
      id,
    });

    return this.triggerMapper.toDTO(entity);
  }

  async update(ctx: IRequestContext, trigger: TriggerDto): Promise<TriggerDto> {
    const triggerRepo = await this.repo(ctx, TriggerEntity);

    await triggerRepo.findOneOrFail({
      tenant: ctx.tenant,
      id: trigger.id,
    });

    const entity = this.triggerMapper.toEntity(trigger);

    const saved = await triggerRepo.save(entity);
    return this.triggerMapper.toDTO(saved);
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    const triggerRepo = await this.repo(ctx, TriggerEntity);
    const entity = await triggerRepo.findOneOrFail({
      tenant: ctx.tenant,
      id: id,
    });

    await entity.remove();
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<TriggerDto>> {
    const triggerRepo = await this.repo(ctx, TriggerEntity);

    query.tenant = ctx.tenant;
    const page = await paginate(triggerRepo, query, []);
    return {
      meta: page.meta,
      items: page.items.map(this.triggerMapper.toDTO),
    };
  }
}
