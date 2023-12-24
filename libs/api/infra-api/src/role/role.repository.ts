import {
  RoleDto,
  RolePageQueryDto,
  RolePermissionAssignmentDto,
} from './role.dto';
import { IRequestContext } from '@libs/nest-core';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';

export interface IRoleRepository {
  create(ctx: IRequestContext, role: Partial<RoleDto>): Promise<RoleDto>;

  batchCreate(
    ctx: IRequestContext,
    roles: Partial<RoleDto>[],
  ): Promise<RoleDto[]>;

  paginate(
    ctx: IRequestContext,
    query: RolePageQueryDto,
  ): Promise<PageDto<RoleDto>>;

  retrieve(ctx: IRequestContext, id: string): Promise<RoleDto | undefined>;

  findByIds(ctx: IRequestContext, ids: string[]): Promise<RoleDto[]>;

  update(
    ctx: IRequestContext,
    id: string,
    data: Partial<RoleDto>,
  ): Promise<{ affected?: number }>;

  delete(ctx: IRequestContext, id: string): Promise<{ affected?: number }>;

  addPermissions(
    ctx: IRequestContext,
    id: string,
    data: RolePermissionAssignmentDto,
  ): Promise<void>;

  removePermissions(
    ctx: IRequestContext,
    id: string,
    data: RolePermissionAssignmentDto,
  ): Promise<void>;
}
