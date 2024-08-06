import { RoleDto } from "../role/role.dto";
import { UserDto } from "../user/user.dto";
import { OrganizationMemberDto } from "./organization-member.dto";



export class OrganizationMemberRoleModel {
    member_id: string;
    member: OrganizationMemberDto;
    role: RoleDto;
    user: UserDto;
    created_at: Date;
    updated_at: Date;
  }
  