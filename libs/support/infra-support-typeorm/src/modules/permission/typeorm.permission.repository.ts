import { Inject, Injectable } from '@nestjs/common';
import {
  PermissionDto,
  PermissionPageQueryDto,
} from 'libs/api/infra-api/src/permission/permission.dto';
import { IPermissionRepository } from 'libs/api/infra-api/src/permission/permission.repository';
import { PageDto, PageMeta } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';
import { FindManyOptions, SelectQueryBuilder } from 'typeorm';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { PermissionEntity } from './permission.entity';

@Injectable()
export class TypeOrmPermissionRepository
  extends TenantAwareRepository
  implements IPermissionRepository {

  async paginate(
    ctx: IRequestContext,
    query: PermissionPageQueryDto,
  ): Promise<PageDto<PermissionDto>> {
    const repo = await this.repo(ctx, PermissionEntity);

    const options: IPaginationOptions<PageMeta> = {
      limit: query.page_size,
      page: query.page,
      metaTransformer: (meta: IPaginationMeta): PageMeta => ({
        total: meta.totalItems,
        page: meta.currentPage,
        page_size: meta.itemsPerPage,
      }),
    };

    const qb = repo.createQueryBuilder('permissions')
    
    {
      qb.leftJoin(`${qb.alias}.resource_server`, 'resource_server')
        .addSelect(['resource_server.identifier', 'resource_server.name']);

      if (query.role_id) {
        qb.leftJoinAndSelect(
          'role_permissions',
          'role_permissions',
          `role_permissions.permission_id = ${qb.alias}.id`,
        ).andWhere('role_permissions.role_id =:role_id', {
          role_id: query.role_id,
        });
      }

      if (query.user_id) {
        qb.leftJoinAndSelect(
          'user_permissions',
          'user_permissions',
          `user_permissions.permission_id = ${qb.alias}.id`,
        ).andWhere('user_permissions.user_id = :user_id AND user_permissions.tenant = :tenant', {
          user_id: query.user_id,
          tenant: ctx.tenant,
        });
      }
    };

    const result = await paginate<PermissionEntity, PageMeta>(
      qb,
      options,
    );

    return {
      items: result.items?.map((it) => ({
        id: it.id,
        description: it.description,
        permission_name: it.name,
        resource_server_identifier: it.resource_server!.identifier,
        resource_server_name: it.resource_server!.name,
      })),
      meta: result.meta,
    };
  }
}
