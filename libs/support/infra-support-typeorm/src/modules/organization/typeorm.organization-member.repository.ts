import {
  PageQueryDto,
  PageDto,
  PageMeta,
} from 'libs/common/src/pagination/pagination.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IOrganizationMemberRepository } from 'libs/api/infra-api/src/organization/organization-member.repository';
import { OrganizationMemberDto } from 'libs/api/infra-api/src/organization/organization-member.dto';
import {
  OrganizationMemberEntity,
  OrganizationMemberRoleEntity,
} from './organization.entity';
import { OrganizationMemberMapper } from './organization-member.mapper';
import { FindManyOptions, SelectQueryBuilder, Connection, In } from 'typeorm';
import {
  IContext,
  MapperQueryRepository,
  getQueryRepositoryToken,
  Filter,
  Query,
  FindByIdOptions,
} from '@libs/nest-core';
import { PageQuery } from 'libs/common/src/pagination/pagination.model';
import {
  IPaginationOptions,
  IPaginationMeta,
  paginate as _paginate,
} from 'nestjs-typeorm-paginate';
import { PermissionEntity } from '../permission/permission.entity';
import { PermissionDto } from 'libs/api/infra-api/src/permission/permission.dto';
import { TenantAwareTypeOrmQueryRepository } from '@libs/nest-core-typeorm';
import * as _ from 'lodash';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class TypeOrmOrganizationMemberRepository
  extends MapperQueryRepository<OrganizationMemberDto, OrganizationMemberEntity>
  implements IOrganizationMemberRepository
{
  constructor(
    readonly mapper: OrganizationMemberMapper,
    @Inject(getQueryRepositoryToken(OrganizationMemberEntity))
    private readonly repo: TenantAwareTypeOrmQueryRepository<OrganizationMemberEntity>,
  ) {
    super(mapper, repo);
  }

  async findById(
    context: IContext,
    id: string | number,
    opts?: FindByIdOptions<OrganizationMemberDto>,
  ): Promise<OrganizationMemberDto | undefined> {
    const entity = await this.repo.findById(context, id);
    if (!entity) return undefined;

    entity.user = await this.repo.findRelation(
      context,
      UserEntity,
      'user',
      entity,
    );
    return this.mapper.convertToDTO(entity);
  }

  async paginate(
    ctx: IContext,
    query: PageQueryDto,
  ): Promise<PageDto<OrganizationMemberDto>> {
    const connection: Connection = await this.repo.connectionManager.get(ctx);
    const repo = await connection.getRepository(OrganizationMemberEntity);

    const page = await paginate(repo, query, [
      'id',
      'user_id',
      'org_id',
      'roles.role.id',
      'roles.role.name',
    ]);

    return {
      items: page.items.map((it) => this.mapper.convertToDTO(it)),
      meta: page.meta,
    };
  }

  async addRoles(ctx: IContext, member_id: string, role_ids: string[]) {
    const connection: Connection = await this.repo.connectionManager.get(ctx);
    const repo = await connection.getRepository(OrganizationMemberEntity);
    const orgMemberRoleRepo = await connection.getRepository(
      OrganizationMemberRoleEntity,
    );

    const member = await repo.findOne({
      where: {
        tenant: ctx.tenant,
        id: member_id,
      },
      relations: ['roles'],
    });
    if (!member) throw new NotFoundException(`Member ${member_id} not found`);

    // 已经存在的角色，从要添加的角色中过滤出需要添加的
    console.log('exisitingMemberRoles: ', member.roles);
    const toAddRoleIds = role_ids.filter(
      (role_id) => !member.roles.some((it) => it.role.id === role_id),
    );
    console.log('member_id: ', member_id, member.id);
    console.log('toAddRoleIds: ', toAddRoleIds);

    const toAddMemberRoles = toAddRoleIds.map((it) => ({
      tenant: ctx.tenant,
      member: {
        id: member_id,
      },
      role: {
        id: it,
      },
    }));

    await orgMemberRoleRepo.save(toAddMemberRoles);
  }

  async removeRoles(ctx: IContext, member_id: string, role_ids: string[]) {
    const connection: Connection = await this.repo.connectionManager.get(ctx);
    const memberRoleRepo = await connection.getRepository(
      OrganizationMemberRoleEntity,
    );

    const memberRoles = await memberRoleRepo.find({
      where: {
        tenant: ctx.tenant,
        member: {
          id: member_id,
        },
        role: {
          id: In(role_ids),
        },
      },
    });

    await memberRoleRepo.remove(memberRoles);
  }

  async listPermissions(
    ctx: IContext,
    org_id: string,
    user_id: string,
    query: PageQuery,
  ): Promise<PageDto<PermissionDto>> {
    const connection: Connection = await this.repo.connectionManager.get(ctx);
    const permissionRepo = await connection.getRepository(PermissionEntity);

    const options: IPaginationOptions<PageMeta> = {
      limit: query.page_size,
      page: query.page,
      metaTransformer: (meta: IPaginationMeta): PageMeta => ({
        total: meta.totalItems,
        page: meta.currentPage,
        page_size: meta.itemsPerPage,
      }),
    };

    const searchOptions: FindManyOptions<PermissionEntity> = {
      where: (qb: SelectQueryBuilder<PermissionEntity>) => {
        qb.innerJoin(
          `${qb.alias}.resource_server`,
          'resource_server',
        ).addSelect(['resource_server.identifier', 'resource_server.name']);

        if (query.audience) {
          qb.where(`resource_server.identifier = :audience`, {
            audience: query.audience,
          });
        }

        qb.innerJoin(
          'role_permissions',
          'role_permissions',
          `role_permissions.permission_id = ${qb.alias}.id`,
        );

        qb.innerJoin(
          'organization_members',
          'organization_members',
          'organization_members.org_id = :org_id AND organization_members.fk_user_id = :user_id AND organization_members.tenant= :tenant',
          {
            org_id,
            user_id,
            tenant: ctx.tenant,
          },
        );

        qb.innerJoin(
          'organization_member_roles',
          'organization_member_roles',
          'organization_member_roles.role_id = role_permissions.role_id AND organization_member_roles.member_id = organization_members.id',
        );
      },
    };

    const page = await _paginate(permissionRepo, options, searchOptions);

    return {
      items: page.items?.map((it) => {
        return {
          id: it.id,
          description: it.description,
          permission_name: it.name,
          resource_server_identifier: it.resource_server.identifier,
          resource_server_name: it.resource_server.name,
        };
      }),
      meta: page.meta,
    };
  }
}
