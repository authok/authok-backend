import { IContext } from '@libs/nest-core';
import { UserRoleModel } from './user-role.model';
import { Page, PageQuery } from 'libs/common/src/pagination';

export interface IUserRoleRepository {
  retrieve(ctx: IContext, id: string): Promise<UserRoleModel | undefined>;

  create(ctx: IContext, userRole: UserRoleModel): Promise<UserRoleModel>;

  batchCreate(
    ctx: IContext,
    userRoles: Partial<UserRoleModel>[],
  ): Promise<Partial<UserRoleModel>[]>;

  batchDelete(
    ctx: IContext,
    userRoles: Partial<UserRoleModel>[],  
  ): Promise<void>;

  update(
    ctx: IContext,
    userRole: UserRoleModel,
  ): Promise<{ affected?: number }>;

  findBy(
    ctx: IContext,
    userRole: UserRoleModel,
  ): Promise<UserRoleModel | undefined>;

  deleteBy(
    ctx: IContext,
    userRole: UserRoleModel,
  ): Promise<{ affected?: number }>;

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<UserRoleModel>>;
}
