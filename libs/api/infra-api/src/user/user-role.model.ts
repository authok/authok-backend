import { RoleModel } from "../role/role.model";

export class UserRoleModel {
  user_id: string;
  role_id: string;
  role?: RoleModel;
  created_at: Date;
}
