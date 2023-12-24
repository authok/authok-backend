import { IRequestContext } from '@libs/nest-core';
import { UserRoleDto } from './user-role.dto';
import { PageQueryDto, PageDto } from 'libs/common/src/pagination/pagination.dto';

export interface IUserRoleRepository {
  retrieve(ctx: IRequestContext, id: string): Promise<UserRoleDto | undefined>;

  create(ctx: IRequestContext, userRole: UserRoleDto): Promise<UserRoleDto>;

  batchCreate(
    ctx: IRequestContext,
    userRoles: Partial<UserRoleDto>[],
  ): Promise<Partial<UserRoleDto>[]>;

  batchDelete(
    ctx: IRequestContext,
    userRoles: Partial<UserRoleDto>[],  
  ): Promise<void>;

  update(
    ctx: IRequestContext,
    userRole: UserRoleDto,
  ): Promise<{ affected?: number }>;

  findBy(
    ctx: IRequestContext,
    userRole: UserRoleDto,
  ): Promise<UserRoleDto | undefined>;

  deleteBy(
    ctx: IRequestContext,
    userRole: UserRoleDto,
  ): Promise<{ affected?: number }>;

  paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<UserRoleDto>>;
}
