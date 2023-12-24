import { RoleDto } from "../role/role.dto";

export class UserRoleDto {
  user_id: string;
  role_id: string;
  role?: RoleDto;
  created_at: Date;
}
