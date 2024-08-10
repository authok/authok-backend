import { Injectable, Inject } from '@nestjs/common';
import { IContext, IRequestContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { GroupEntity } from './group.entity';
import { 
  IGroupRepository,
  GroupModel,
} from 'libs/api/infra-api/src';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { GroupMapper } from './group.mapper';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

@Injectable()
export class TypeOrmGroupRepository
  extends TenantAwareRepository
  implements IGroupRepository
{
  @Inject()
  private readonly groupMapper: GroupMapper;

  async update(ctx: IRequestContext, _group: Partial<GroupModel>): Promise<GroupModel> {
    const repo = await this.repo(ctx, GroupEntity);
    const group = this.groupMapper.toEntity(_group);
    const { id, ...data } = group;

    await repo.update(
      {
        tenant: ctx.tenant,
        id,
      },
      data,
    );

    const savedGroup = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        id,
      },
    });

    return this.groupMapper.toModel(savedGroup);
  }

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<GroupModel | undefined> {
    const repo = await this.repo(ctx, GroupEntity);
    const group = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        id,
      },
    });

    return this.groupMapper.toModel(group);
  }

  async create(ctx: IContext, _group: Partial<GroupModel>): Promise<GroupModel> {
    const repo = await this.repo(ctx, GroupEntity);
    const group = this.groupMapper.toEntity(_group);
    group.tenant = ctx.tenant;

    return this.groupMapper.toModel(await repo.save(group));
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    const repo = await this.repo(ctx, GroupEntity);
    const group = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        id,
      }
    });

    if (group) {
      await repo.remove(group);
    }
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<GroupModel>> {
    const repo = await this.repo(ctx, GroupEntity);

    query.tenant = ctx.tenant;
    const page = await paginate<GroupEntity>(repo, query, [
      'tenant',
      'id',
      'name',
      'type',
      'parent_id',
    ]);

    return {
      meta: page.meta,
      items: page.items.map((it) => this.groupMapper.toModel(it)),
    };
  }

  async findByOuterId(
    ctx: IContext,
    type: string,
    outer_id: string,
  ): Promise<GroupModel | undefined> {
    const repo = await this.repo(ctx, GroupEntity);

    const group = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        type,
        outer_id,
      },
    });

    return this.groupMapper.toModel(group);
  }
}
