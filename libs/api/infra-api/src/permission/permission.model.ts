import { PageQuery } from 'libs/common/src/pagination/pagination.model';

export class ScopeDto {
  value: string;
  description: string;
}

export class PermissionSourceModel {
  source_id: string;
  source_name: string;
  source_type: string;
}

export class PermissionModel {
  resource_server_identifier: string;
  permission_name: string;
  resource_server_name?: string;
  description?: string;
  sources?: PermissionSourceModel[];
}

export interface PermissionPageQuery extends PageQuery {
  role_id?: string;
  user_id?: string;
}
