import { IRequestContext } from '@libs/nest-core';
import { Inject, Injectable } from '@nestjs/common';
import { OrganizationMemberRoleMapper } from './organization-member-role.mapper';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { OrganizationMemberRoleEntity } from './organization.entity';
import { IOrganizationMemberRoleRepository, OrganizationMemberRoleModel } from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { paginate as _paginate, IPaginationMeta, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Page, PageMeta, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class TypeOrmOrganizationMemberRoleRepository
  extends TenantAwareRepository
  implements IOrganizationMemberRoleRepository
{
  @Inject()
  private readonly organizationMemberRoleMapper: OrganizationMemberRoleMapper;

  async retrieve(
    ctx: IContext,
    member_id: string,
    role_id: string,
  ): Promise<OrganizationMemberRoleModel | undefined> {
    const repo = await this.repo(ctx, OrganizationMemberRoleEntity);

    const entity = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        member_id,
        role_id,
      }
    });

    return this.organizationMemberRoleMapper.toDTO(entity);
  }

  async update(
    ctx: IRequestContext,
    data: Partial<OrganizationMemberRoleModel>,
  ): Promise<OrganizationMemberRoleModel> {
    const repo = await this.repo(ctx, OrganizationMemberRoleEntity);

    const toUpdate = this.organizationMemberRoleMapper.toEntity(data);

    await repo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        member_id: toUpdate.member_id,
        role_id: toUpdate.role_id,
      }
    });

    const entity = await repo.save(toUpdate);

    return this.organizationMemberRoleMapper.toDTO(entity);
  }

  async delete(
    ctx: IContext,
    member_id: string,
    role_id: string,
  ): Promise<void> {
    const repo = await this.repo(ctx, OrganizationMemberRoleEntity);

    const entity = await repo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        member_id,
        role_id,
      }
    });

    await repo.remove(entity);
  }

  async create(
    ctx: IContext,
    body: OrganizationMemberRoleModel,
  ): Promise<OrganizationMemberRoleModel> {
    const repo = await this.repo(ctx, OrganizationMemberRoleEntity);

    const toSave = this.organizationMemberRoleMapper.toEntity(body);
    toSave.tenant = ctx.tenant;

    const entity = await repo.save(toSave);

    return this.organizationMemberRoleMapper.toDTO(entity);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<OrganizationMemberRoleModel>> {
    const memberRoleRepo = await this.repo(ctx, OrganizationMemberRoleEntity);

    const options: IPaginationOptions<PageMeta> = {
      limit: Math.min(query.per_page, 100),
      page: query.page,
      metaTransformer: (meta: IPaginationMeta): PageMeta => ({
        total: meta.totalItems,
        page: meta.currentPage,
        per_page: meta.itemsPerPage,
      }),
    };

    const qb = memberRoleRepo.createQueryBuilder();
    
    {
      qb.where(`${qb.alias}.tenant = :tenant`, {
        tenant: ctx.tenant,
      });

      qb.leftJoinAndSelect(
        `${qb.alias}.member`,
        'organization_members',
        // `organization_members.id = ${qb.alias}.member.id`,
      )

      qb.leftJoinAndSelect(
        `${qb.alias}.role`,
        'roles',
        // `roles.id = ${qb.alias}.role_id`,
      )

      if (query.org_id) {
        qb.where(`organization_members.org_id = :org_id`, {
          org_id: query.org_id,
        });
      }

      if (query.user_id) {
        qb.where(`organization_members.user_id = :user_id`, {
          user_id: query.user_id,
        });
      }

      if (query.sort) {
        const order_by = {};
        const items = query.sort.split(' ');
        for (const item of items) {
          if (item.startsWith('-')) {
            order_by[item.substring(1)] = 'DESC';
          } else {
            order_by[item] = 'ASC';
          }
        }

        const _order_by = {};
        for (const k in order_by) {
          _order_by[`${qb.alias}.${k}`] = order_by[k];
        }
        qb.orderBy(_order_by);
      } else {
        qb.orderBy(`${qb.alias}.created_at`, 'DESC');
      }
    }

    const page = await _paginate<OrganizationMemberRoleEntity, PageMeta>(
      qb,
      options,
    );

    return {
      items: page.items.map(this.organizationMemberRoleMapper.toDTO),
      meta: page.meta,
    };
  }
}
