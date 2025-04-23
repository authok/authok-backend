import { PermissionModel } from "../permission/permission.model";
import { IContext, QueryRepository } from "@libs/nest-core";
import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";
import { OrganizationMemberModel } from "./organization-member.model";

export interface IOrganizationMemberRepository extends QueryRepository<OrganizationMemberModel> {
  paginate(ctx: IContext, org_id: string, query: PageQuery): Promise<Page<OrganizationMemberModel>>;

  addRoles(ctx: IContext, member_id: string, role_ids: string[]);
  
  removeRoles(ctx: IContext, member_id: string, role_ids: string[]);

  listPermissions(ctx: IContext, org_id: string, user_id: string, query: PageQuery): Promise<Page<PermissionModel>>;

  findByOrgIdAndUserId(
    context: IContext,
    org_id: string,
    user_id: string,
  ): Promise<OrganizationMemberModel | undefined>;
}