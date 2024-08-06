import {
  RoleModel,
  RolePermissionAssignmentModel,
  RoleUsersModel,
} from './role.model';
import { IContext, IRequestContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export interface IRoleService {
  create(ctx: IContext, role: Partial<RoleModel>): Promise<RoleModel | undefined>;

  batchCreate(
    ctx: IContext,
    roles: Partial<RoleModel>[],
  ): Promise<RoleModel[]>;

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<RoleModel>>;

  retrieve(ctx: IContext, id: string): Promise<RoleModel | undefined>;

  update(
    ctx: IContext,
    id: string,
    data: Partial<RoleModel>,
  ): Promise<RoleModel>;

  delete(ctx: IContext, id: string): Promise<void>;

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

  assignUsers(
    ctx: IContext,
    id: string,
    data: RoleUsersModel,
  ): Promise<void>;

  unassignUsers(
    ctx: IContext,
    id: string,
    data: RoleUsersModel,
  ): Promise<void>;
}