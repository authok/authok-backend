import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { OrganizationMemberRoleDto } from './organization-member-role.dto';
import { IContext } from '@libs/nest-core';

export interface IOrganizationMemberRoleRepository {
  retrieve(
    ctx: IContext,
    member_id: string,
    role_id: string,
  ): Promise<OrganizationMemberRoleDto | undefined>;

  update(
    ctx: IContext,
    data: Partial<OrganizationMemberRoleDto>,
  ): Promise<OrganizationMemberRoleDto>;

  delete(ctx: IContext, member_id: string, role_id: string): Promise<void>;

  create(
    ctx: IContext,
    body: OrganizationMemberRoleDto,
  ): Promise<OrganizationMemberRoleDto>;

  paginate(
    ctx: IContext,
    query: PageQueryDto,
  ): Promise<PageDto<OrganizationMemberRoleDto>>;
}
