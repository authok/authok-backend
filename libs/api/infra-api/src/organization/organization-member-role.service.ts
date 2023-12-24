import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';
import { OrganizationMemberRoleDto, OrganizationMemberRolePageQueryDto } from './organization-member-role.dto';

export interface IOrganizationMemberRoleService {
  retrieve(
    ctx: IRequestContext,
    member_id: string,
    role_id: string,
  ): Promise<OrganizationMemberRoleDto | undefined>;

  update(
    ctx: IRequestContext,
    data: Partial<OrganizationMemberRoleDto>,
  ): Promise<OrganizationMemberRoleDto>;

  delete(ctx: IRequestContext, member_id: string, role_id: string): Promise<void>;

  create(
    ctx: IRequestContext,
    body: OrganizationMemberRoleDto,
  ): Promise<OrganizationMemberRoleDto>;

  paginate(
    ctx: IRequestContext,
    query: OrganizationMemberRolePageQueryDto,
  ): Promise<PageDto<OrganizationMemberRoleDto>>;
}
