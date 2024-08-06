import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';
import { OrganizationMemberRolePageQueryDto } from './organization-member-role.dto';
import { OrganizationMemberRoleModel } from './organization-member-role.model';

export interface IOrganizationMemberRoleService {
  retrieve(
    ctx: IRequestContext,
    member_id: string,
    role_id: string,
  ): Promise<OrganizationMemberRoleModel | undefined>;

  update(
    ctx: IRequestContext,
    data: Partial<OrganizationMemberRoleModel>,
  ): Promise<OrganizationMemberRoleModel>;

  delete(ctx: IRequestContext, member_id: string, role_id: string): Promise<void>;

  create(
    ctx: IRequestContext,
    body: OrganizationMemberRoleModel,
  ): Promise<OrganizationMemberRoleModel>;

  paginate(
    ctx: IRequestContext,
    query: OrganizationMemberRolePageQueryDto,
  ): Promise<PageDto<OrganizationMemberRoleModel>>;
}
