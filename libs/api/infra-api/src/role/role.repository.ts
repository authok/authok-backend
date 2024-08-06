import { Page } from 'libs/common/src/pagination/pagination.model';
import {
  RoleModel,
  RolePageQuery,
  RolePermissionAssignmentModel,
} from './role.model';
import { IContext } from '@libs/nest-core';

export interface IRoleRepository {
  create(ctx: IContext, role: Partial<RoleModel>): Promise<RoleModel>;

  batchCreate(
    ctx: IContext,
    roles: Partial<RoleModel>[],
  ): Promise<RoleModel[]>;

  paginate(
    ctx: IContext,
    query: RolePageQuery,
  ): Promise<Page<RoleModel>>;

  retrieve(ctx: IContext, id: string): Promise<RoleModel | null>;

  findByIds(ctx: IContext, ids: string[]): Promise<RoleModel[]>;

  update(
    ctx: IContext,
    id: string,
    data: Partial<RoleModel>,
  ): Promise<{ affected?: number }>;

  delete(ctx: IContext, id: string): Promise<{ raw: any; affected?: number | null }>;

  addPermissions(
    ctx: IContext,
    id: string,
    data: RolePermissionAssignmentModel,
  ): Promise<void>;

  removePermissions(
    ctx: IContext,
    id: string,
    data: RolePermissionAssignmentModel,
  ): Promise<void>;
}
