import { Injectable, Inject } from '@nestjs/common';
import { IRequestContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { IGroup } from 'libs/api/infra-api/src/group/group';
import { GroupEntity } from './group.entity';
import { IGroupRepository } from 'libs/api/infra-api/src/group/group.repository';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { GroupMapper } from './group.mapper';

@Injectable()
export class TypeOrmGroupRepository
  extends TenantAwareRepository
  implements IGroupRepository
{
  @Inject()
  private readonly groupMapper: GroupMapper;

  async update(ctx: IRequestContext, _group: Partial<IGroup>): Promise<IGroup> {
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

    return this.groupMapper.toDTO(savedGroup);
  }

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<IGroup | undefined> {
    const repo = await this.repo(ctx, GroupEntity);
    const group = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        id,
      },
    });

    return this.groupMapper.toDTO(group);
  }

  async create(ctx: IRequestContext, _group: Partial<IGroup>): Promise<IGroup> {
    const repo = await this.repo(ctx, GroupEntity);
    const group = this.groupMapper.toEntity(_group);
    group.tenant = ctx.tenant;

    return this.groupMapper.toDTO(await repo.save(group));
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    const repo = await this.repo(ctx, GroupEntity);
    const group = await repo.findOne({
      tenant: ctx.tenant,
      id,
    });

    if (group) {
      await repo.remove(group);
    }
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<IGroup>> {
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
      items: page.items.map((it) => this.groupMapper.toDTO(it)),
    };
  }

  async findByOuterId(
    ctx: IRequestContext,
    type: string,
    outer_id: string,
  ): Promise<IGroup | undefined> {
    const repo = await this.repo(ctx, GroupEntity);

    const group = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        type,
        outer_id,
      },
    });

    return this.groupMapper.toDTO(group);
  }
}
