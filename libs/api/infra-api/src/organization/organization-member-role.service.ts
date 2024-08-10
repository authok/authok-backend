import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { OrganizationMemberRolePageQuery, OrganizationMemberRoleModel } from './organization-member-role.model';
import { IContext } from '@libs/nest-core';

export interface IOrganizationMemberRoleService {
  retrieve(
    ctx: IContext,
    member_id: string,
    role_id: string,
  ): Promise<OrganizationMemberRoleModel | undefined>;

  update(
    ctx: IContext,
    data: Partial<OrganizationMemberRoleModel>,
  ): Promise<OrganizationMemberRoleModel>;

  delete(ctx: IContext, member_id: string, role_id: string): Promise<void>;

  create(
    ctx: IContext,
    body: OrganizationMemberRoleModel,
  ): Promise<OrganizationMemberRoleModel>;

  paginate(
    ctx: IContext,
    query: OrganizationMemberRolePageQuery,
  ): Promise<PageDto<OrganizationMemberRoleModel>>;
}
