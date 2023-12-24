import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';
import { OrganizationMemberRoleDto, OrganizationMemberRolePageQueryDto } from 'libs/api/infra-api/src/organization/organization-member-role.dto';
import { Inject } from '@nestjs/common';
import { IOrganizationMemberRoleService } from 'libs/api/infra-api/src/organization/organization-member-role.service';
import { IOrganizationMemberRoleRepository } from 'libs/api/infra-api/src/organization/organization-member-role.repository';

export class OrganizationMemberRoleService implements IOrganizationMemberRoleService {
  constructor(
    @Inject('IOrganizationMemberRoleRepository')
    private readonly organizationMemberRoleRepository: IOrganizationMemberRoleRepository,
  ) {}
  
  async retrieve(
    ctx: IRequestContext,
    member_id: string,
    role_id: string,
  ): Promise<OrganizationMemberRoleDto | undefined> {
    return await this.organizationMemberRoleRepository.retrieve(ctx, member_id, role_id);
  }

  async update(
    ctx: IRequestContext,
    data: Partial<OrganizationMemberRoleDto>,
  ): Promise<OrganizationMemberRoleDto> {
    return await this.organizationMemberRoleRepository.update(ctx, data);
  }

  async delete(ctx: IRequestContext, member_id: string, role_id: string): Promise<void> {
    await this.organizationMemberRoleRepository.delete(ctx, member_id, role_id);
  }

  async create(
    ctx: IRequestContext,
    organizationMemberRole: OrganizationMemberRoleDto,
  ): Promise<OrganizationMemberRoleDto> {
    return await this.organizationMemberRoleRepository.create(ctx, organizationMemberRole);
  }

  async paginate(
    ctx: IRequestContext,
    query: OrganizationMemberRolePageQueryDto,
  ): Promise<PageDto<OrganizationMemberRoleDto>> {
    return await this.organizationMemberRoleRepository.paginate(ctx, query);
  }
}
