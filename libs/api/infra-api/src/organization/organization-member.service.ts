import { IContext } from "@libs/nest-core";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { OrganizationMemberModel } from "./organization-member.model";
import { PermissionModel } from "../permission/permission.model";
import { PageQuery } from "libs/common/src/pagination/pagination.model";

export interface IOrganizationMemberService {
  create(ctx: IContext, groupMember: Partial<OrganizationMemberModel>): Promise<OrganizationMemberModel>;

  retrieve(ctx: IContext, member_id: string): Promise<OrganizationMemberModel | undefined>;

  findByRelation(ctx: IContext, org_id: string, user_id: string): Promise<OrganizationMemberModel | undefined>;

  update(ctx: IContext, member_id: string, data: Partial<OrganizationMemberModel>): Promise<OrganizationMemberModel>;

  delete(ctx: IContext, member_id: string): Promise<void>;

  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<OrganizationMemberModel>>;

  addRoles(ctx: IContext, member_id: string, role_ids: string[]);
  
  removeRoles(ctx: IContext, member_id: string, role_ids: string[]);

  listPermissions(ctx: IContext, org_id: string, user_id: string, query: PageQuery): Promise<PageDto<PermissionModel>>;
}