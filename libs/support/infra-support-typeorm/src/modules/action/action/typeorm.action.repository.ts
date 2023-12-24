import { IRequestContext } from '@libs/nest-core';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { Inject } from '@nestjs/common';
import { ActionEntity } from '../action/action.entity';
import { ActionMapper } from './action.mapper';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { ActionDto } from 'libs/api/infra-api/src/action/action/action.dto';
import { IActionRepository } from 'libs/api/infra-api/src/action/action/action.repository';

export class TypeOrmActionRepository
  extends TenantAwareRepository
  implements IActionRepository
{
  @Inject()
  private actionMapper: ActionMapper;

  async create(ctx: IRequestContext, action: ActionDto): Promise<ActionDto> {
    const actionRepo = await this.repo(ctx, ActionEntity);

    const entity = this.actionMapper.toEntity(ctx, action);

    console.log('action: ', entity);
    const saved = await actionRepo.save(entity);
    return this.actionMapper.toDTO(saved);
  }

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<ActionDto | undefined> {
    const actionRepo = await this.repo(ctx, ActionEntity);
    const entity = await actionRepo.findOne(id);

    return this.actionMapper.toDTO(entity);
  }

  async update(
    ctx: IRequestContext,
    action: Partial<ActionDto>,
  ): Promise<ActionDto> {
    const actionRepo = await this.repo(ctx, ActionEntity);

    await actionRepo.findOneOrFail({
      tenant: ctx.tenant,
      id: action.id,
    });

    const entity = this.actionMapper.toEntity(ctx, action);

    const saved = await actionRepo.save(entity);
    return this.actionMapper.toDTO(saved);
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    const actionRepo = await this.repo(ctx, ActionEntity);
    const entity = await actionRepo.findOneOrFail({
      tenant: ctx.tenant,
      id: id,
    });

    await entity.remove();
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<ActionDto>> {
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
