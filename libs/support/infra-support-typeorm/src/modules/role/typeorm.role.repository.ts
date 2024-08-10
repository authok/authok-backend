import {
  RoleModel,
  RolePageQuery,
  RolePermissionAssignmentModel,
  IRoleRepository,
} from 'libs/api/infra-api/src';
import { FindManyOptions, In, SelectQueryBuilder } from 'typeorm';
import { RoleEntity } from './role.entity';
import { IContext } from '@libs/nest-core';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PermissionEntity } from '../permission/permission.entity';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { Page, PageMeta } from 'libs/common/src/pagination';

export class TypeOrmRoleRepository
  extends TenantAwareRepository
  implements IRoleRepository {

  async create(ctx: IContext, role: Partial<RoleModel>): Promise<RoleModel> {
    const repo = await this.repo(ctx, RoleEntity);
    const existingRole = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        name: role.name,
      },
    });

    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    const _role: Partial<RoleEntity> = {
      tenant: ctx.tenant,
      name: role.name,
      description: role.description,
    };

    const savedRole = await repo.save(repo.create(_role));
    delete savedRole.tenant;
    return savedRole;
  }

  async batchCreate(
    ctx: IContext,
    _roles: Partial<RoleModel>[],
  ): Promise<RoleModel[]> {
    const repo = await this.repo(ctx, RoleEntity);
    const __roles: Partial<RoleEntity>[] = _roles.map((it) => ({
      ...it,
      tenant: ctx.tenant,
    }));
    const roles = repo.create(__roles);

    const savedRoles = await repo.save(roles);

    return savedRoles.map(({ tenant, ...rest}) => rest);
  }

  async paginate(
    ctx: IContext,
    query: RolePageQuery,
  ): Promise<Page<RoleModel>> {
    const repo = await this.repo(ctx, RoleEntity);
    const options: IPaginationOptions<PageMeta> = {
      limit: query.per_page,
      page: query.page,
      metaTransformer: (meta: IPaginationMeta): PageMeta => ({
        total: meta.totalItems,
        page: meta.currentPage,
        per_page: meta.itemsPerPage,
      }),
    };

    const qb = repo.createQueryBuilder('roles')

    {
      qb.where(`${qb.alias}.tenant = :tenant`, {
        tenant: ctx.tenant,
      });

      if (query.user_id) {
        qb.leftJoinAndSelect(
          'user_roles',
          'user_roles',
          `user_roles.fk_role_id = ${qb.alias}.id`,
        ).andWhere('user_roles.fk_user_id = :user_id AND user_roles.tenant = :tenant', {
          user_id: query.user_id,
          tenant: ctx.tenant,
        });
      }
    }

    const page = await paginate<RoleEntity, PageMeta>(qb, options);

    return {
      items: page.items,
      meta: page.meta,
    };
  }

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<RoleModel | null> {
    const repo = await this.repo(ctx, RoleEntity);
    return await repo.findOne({
      where: {
        tenant: ctx.tenant,
        id,
      },
    });
  }

  async findByIds(ctx: IContext, ids: string[]): Promise<RoleModel[]> {
    const repo = await this.repo(ctx, RoleEntity);
    return await repo.findBy({
      id: In(ids),
      tenant: ctx.tenant,
    });
  }

  async update(
    ctx: IContext,
    id: string,
    data: Partial<RoleModel>,
  ): Promise<{ affected?: number }> {
    const repo = await this.repo(ctx, RoleEntity);
    return await repo.update({ tenant: ctx.tenant, id }, data);
  }

  async delete(
    ctx: IContext,
    id: string,
  ): Promise<{ raw: any; affected?: number | null; }> {
    const repo = await this.repo(ctx, RoleEntity);
    return await repo.delete({
      tenant: ctx.tenant,
      id,
    });
  }

  async addPermissions(
    ctx: IContext,
    id: string,
    data: RolePermissionAssignmentModel,
  ): Promise<void> {
    const repo = await this.repo(ctx, RoleEntity);
    const permissionRepo = await this.repo(ctx, PermissionEntity);

    const role = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        id,
      },
      relations: ['permissions'],
    });

    if (!role) throw new NotFoundException('Role not found');

    let permissions = await Promise.all(
      data.permissions?.map(async (it) => {
        return await permissionRepo
          .createQueryBuilder('permission')
          .leftJoin('permission.resource_server', 'resource_server')
          .where(
            'resource_server.tenant = :tenant AND resource_server.identifier = :identifier AND permission.name = :permission_name',
            {
              tenant: ctx.tenant,
              identifier: it.resource_server_identifier,
              permission_name: it.permission_name,
            },
          )
          .getOne();
      }),
    );
    permissions = permissions.filter((it) => !!it);
    console.log('permissions: ', permissions);

    role.permissions = role.permissions || [];
    role.permissions.push(...permissions);
    console.log('role.permissions: ', role.permissions);

    await repo.save(role);
  }

  async removePermissions(
    ctx: IContext,
    id: string,
    data: RolePermissionAssignmentModel,
  ): Promise<void> {
    const repo = await this.repo(ctx, RoleEntity);
    const permissionRepo = await this.repo(ctx, PermissionEntity);

    const role = await repo.findOneOrFail({
      where: {
        tenant: ctx.tenant,
        id,
      },
    });

    const permissions = await Promise.all(
      data.permissions?.map(async (it) => {
        return await permissionRepo
          .createQueryBuilder('permission')
          .leftJoin('permission.resource_server', 'resource_server')
          .where(
            'permission.name = :permission_name AND resource_server.tenant = :tenant AND resource_server.identifier = :identifier',
            {
              permission_name: it.permission_name,
              tenant: ctx.tenant,
              identifier: it.resource_server_identifier,
            },
          )
          .getOne();
      }),
    );
    console.log('permissions: ', permissions);

    await repo
      .createQueryBuilder()
      .delete()
      .from(RoleEntity)
      .relation(RoleEntity, 'permissions')
      .of(role)
      .remove(permissions);
  }
}
