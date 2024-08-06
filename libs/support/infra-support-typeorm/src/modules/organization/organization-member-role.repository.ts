import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';
import { IOrganizationMemberRoleRepository } from 'libs/api/infra-api/src/organization/organization-member-role.repository';
import { Inject, Injectable } from '@nestjs/common';
import { OrganizationMemberRoleMapper } from './organization-member-role.mapper';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { OrganizationMemberRoleEntity } from './organization.entity';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { OrganizationMemberRoleDto } from 'libs/api/infra-api/src/organization/organization-member-role.dto';
import { IContext } from '@libs/nest-core';

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
  ): Promise<OrganizationMemberRoleDto | undefined> {
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
    data: Partial<OrganizationMemberRoleDto>,
  ): Promise<OrganizationMemberRoleDto> {
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
    body: OrganizationMemberRoleDto,
  ): Promise<OrganizationMemberRoleDto> {
    const repo = await this.repo(ctx, OrganizationMemberRoleEntity);

    const toSave = this.organizationMemberRoleMapper.toEntity(body);
    toSave.tenant = ctx.tenant;

    const entity = await repo.save(toSave);

    return this.organizationMemberRoleMapper.toDTO(entity);
  }

  async paginate(
    ctx: IContext,
    query: PageQueryDto,
  ): Promise<PageDto<OrganizationMemberRoleDto>> {
    const repo = await this.repo(ctx, OrganizationMemberRoleEntity);

    const page = await paginate(repo, query, ['member_id', 'role_id']);
    return {
      items: page.items.map(this.organizationMemberRoleMapper.toDTO),
      meta: page.meta,
    };
  }
}
