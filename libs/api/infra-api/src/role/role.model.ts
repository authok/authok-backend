import { OmitType, PartialType } from '@nestjs/swagger';
import { PageQuery } from 'libs/common/src/pagination/pagination.model';

export class RoleModel {
  id: string;
  name: string;
  description: string;
  created_at?: Date;
}

export class CreateRoleModel extends OmitType(RoleModel, [
  'id',
  'created_at'
]) {}

export class UpdateRoleModel extends PartialType(CreateRoleModel) {}

export class RolePermissionAssignmentModel {
  permissions: {
    resource_server_identifier: string;
    permission_name: string;
  }[];
}

export interface RolePageQuery extends PageQuery {
  user_id?: string;
}

export class RoleUsersModel {
  users: string[];
}

export class PostUserRoleModel {
  roles: string[];
}
