import { IContext } from '@libs/nest-core';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { Inject } from '@nestjs/common';
import { ActionEntity } from '../action/action.entity';
import { ActionMapper } from './action.mapper';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { ActionModel, IActionRepository } from 'libs/api/infra-api/src';
import { Page, PageQuery } from 'libs/common/src/pagination';

export class TypeOrmActionRepository
  extends TenantAwareRepository
  implements IActionRepository
{
  @Inject()
  private actionMapper: ActionMapper;

  async create(ctx: IContext, action: ActionModel): Promise<ActionModel> {
    const actionRepo = await this.repo(ctx, ActionEntity);

    const entity = this.actionMapper.toEntity(ctx, action);

    console.log('action: ', entity);
    const saved = await actionRepo.save(entity);
    return this.actionMapper.toDTO(saved);
  }

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<ActionModel | undefined> {
    const actionRepo = await this.repo(ctx, ActionEntity);
    const entity = await actionRepo.findOne({
      where: { id },
    });

    return this.actionMapper.toDTO(entity);
  }

  async update(
    ctx: IContext,
    action: Partial<ActionModel>,
  ): Promise<ActionModel> {
    const actionRepo = await this.repo(ctx, ActionEntity);

    await actionRepo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        id: action.id,
      }
    });

    const entity = this.actionMapper.toEntity(ctx, action);

    const saved = await actionRepo.save(entity);
    return this.actionMapper.toDTO(saved);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    const actionRepo = await this.repo(ctx, ActionEntity);
    const entity = await actionRepo.findOneOrFail({
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
  ): Promise<Page<ActionModel>> {
    const triggerBindingRepo = await this.repo(ctx, ActionEntity);

    query.tenant = ctx.tenant;

    const page = await paginate(triggerBindingRepo, query, [
      'trigger_id',
      'action_id',
    ]);

    return {
      meta: page.meta,
      items: page.items.map(this.actionMapper.toDTO),
    };
  }
}
