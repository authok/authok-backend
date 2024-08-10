import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import {
  UpdateTriggerBindingModel,
  TriggerBindingModel,
  ITriggerBindingRepository,
} from 'libs/api/infra-api/src';
import { Inject } from '@nestjs/common';
import { TriggerBindingEntity } from './trigger-binding.entity';
import { plainToClass } from 'class-transformer';
import { ActionEntity } from '../action/action.entity';
import { ActionMapper } from '../action/action.mapper';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { TriggerEntity } from '../trigger/trigger.entity';
import { EntityManager } from 'typeorm';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination';

export class TypeOrmTriggerBindingRepository
  extends TenantAwareRepository
  implements ITriggerBindingRepository
{
  @Inject()
  private actionMapper: ActionMapper;

  async update(
    ctx: IContext,
    trigger_id: string,
    bindings: UpdateTriggerBindingModel[],
  ): Promise<TriggerBindingModel[]> {
    const triggerBindingRepo = await this.repo(ctx, TriggerBindingEntity);

    const existBindings = await triggerBindingRepo.find({
      where: {
        trigger: {
          tenant: ctx.tenant,
          id: trigger_id,
        },
      },
    });

    // TODO 判断 ref的类型 可能并不为 action_id
    const toSave = bindings.map((it, index) => {
      if (it.ref.type === 'binding_id') {
        return plainToClass(TriggerBindingEntity, {
          id: it.ref.value,
          index,
        });
      } else {
        return plainToClass(TriggerBindingEntity, {
          display_name: it.display_name,
          index,
          trigger: plainToClass(TriggerEntity, {
            id: trigger_id,
            tenant: ctx.tenant,
          }),
          action: plainToClass(ActionEntity, {
            id: it.ref.value,
          }),
        });
      }
    });

    const reserved = bindings
      .filter((it) => it.ref.type === 'binding_id')
      .map((it) => it.ref.value);
    const reservedSet = new Set(reserved);

    const toDelete = existBindings.filter((it) => !reservedSet.has(it.id));

    const manager = await this.getManager(ctx);

    const updated = await manager.transaction(
      async (entityManager: EntityManager) => {
        await entityManager.remove(toDelete);

        return await triggerBindingRepo.save(toSave);
      },
    );

    console.log('updated: ', updated);

    return updated.map((entity) =>
      plainToClass(TriggerBindingModel, {
        id: entity.id,
        trigger_id: entity.trigger_relation_id?.trigger_id,
        display_name: entity.display_name,
        action: this.actionMapper.toDTO(entity.action),
      }),
    );
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<TriggerBindingModel>> {
    const triggerBindingRepo = await this.repo(ctx, TriggerBindingEntity);

    query.tenant = ctx.tenant;

    const page = await paginate(triggerBindingRepo, query, [
      'trigger_id',
      'action_id',
    ]);

    return {
      meta: page.meta,
      items: page.items.map((entity) =>
        plainToClass(TriggerBindingModel, {
          id: entity.id,
          trigger_id: entity.trigger_relation_id?.trigger_id,
          display_name: entity.display_name,
          action: this.actionMapper.toDTO(entity.action),
          created_at: entity.created_at,
          updated_at: entity.updated_at,
        }),
      ),
    };
  }
}
