import { PageQuery } from "libs/common/src/pagination/pagination.model";
import { RoleModel } from "../role/role.model";
import { UserModel } from "../user/user.model";
import { OrganizationMemberModel } from "./organization-member.model";



export class OrganizationMemberRoleModel {
  member_id: string;
  member: OrganizationMemberModel;
  role: RoleModel;
  user?: UserModel;
  created_at: Date;
  updated_at: Date;
}
  
export class OrganizationMemberRolePageQuery implements PageQuery {
  member_id: string;
  role_id: string;
}