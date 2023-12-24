import {
  RoleDto,
  RolePermissionAssignmentDto,
  RoleUsersDto,
} from './role.dto';
import { IRequestContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

export interface IRoleService {
  create(ctx: IRequestContext, role: Partial<RoleDto>): Promise<RoleDto | undefined>;

  batchCreate(
    ctx: IRequestContext,
    roles: Partial<RoleDto>[],
  ): Promise<RoleDto[]>;

  paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<RoleDto>>;

  retrieve(ctx: IRequestContext, id: string): Promise<RoleDto | undefined>;

  update(
    ctx: IRequestContext,
    id: string,
    data: Partial<RoleDto>,
  ): Promise<RoleDto>;

  delete(ctx: IRequestContext, id: string): Promise<void>;

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

  assignUsers(
    ctx: IRequestContext,
    id: string,
    data: RoleUsersDto,
  ): Promise<void>;

  unassignUsers(
    ctx: IRequestContext,
    id: string,
    data: RoleUsersDto,
  ): Promise<void>;
}
