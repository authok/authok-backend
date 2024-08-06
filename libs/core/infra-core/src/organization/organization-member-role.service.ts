import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IContext } from '@libs/nest-core';
import { OrganizationMemberRolePageQuery } from 'libs/api/infra-api/src/organization/organization-member-role.model';
import { Inject } from '@nestjs/common';
import { IOrganizationMemberRoleService } from 'libs/api/infra-api/src/organization/organization-member-role.service';
import { IOrganizationMemberRoleRepository } from 'libs/api/infra-api/src/organization/organization-member-role.repository';
import { OrganizationMemberRoleModel } from 'libs/api/infra-api/src/organization/organization-member-role.model';

export class OrganizationMemberRoleService implements IOrganizationMemberRoleService {
  constructor(
    @Inject('IOrganizationMemberRoleRepository')
    private readonly organizationMemberRoleRepository: IOrganizationMemberRoleRepository,
  ) {}
  
  async retrieve(
    ctx: IContext,
    member_id: string,
    role_id: string,
  ): Promise<OrganizationMemberRoleModel | undefined> {
    return await this.organizationMemberRoleRepository.retrieve(ctx, member_id, role_id);
  }

  async update(
    ctx: IContext,
    data: Partial<OrganizationMemberRoleModel>,
  ): Promise<OrganizationMemberRoleModel> {
    return await this.organizationMemberRoleRepository.update(ctx, data);
  }

  async delete(ctx: IContext, member_id: string, role_id: string): Promise<void> {
    await this.organizationMemberRoleRepository.delete(ctx, member_id, role_id);
  }

  async create(
    ctx: IContext,
    organizationMemberRole: OrganizationMemberRoleModel,
  ): Promise<OrganizationMemberRoleModel> {
    return await this.organizationMemberRoleRepository.create(ctx, organizationMemberRole);
  }

  async paginate(
    ctx: IContext,
    query: OrganizationMemberRolePageQuery,
  ): Promise<PageDto<OrganizationMemberRoleModel>> {
    return await this.organizationMemberRoleRepository.paginate(ctx, query);
  }
}
