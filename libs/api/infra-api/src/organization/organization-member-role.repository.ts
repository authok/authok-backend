import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { IContext } from '@libs/nest-core';
import { OrganizationMemberRoleModel } from './organization-member-role.model';

export interface IOrganizationMemberRoleRepository {
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
    query: PageQueryDto,
  ): Promise<PageDto<OrganizationMemberRoleModel>>;
}
