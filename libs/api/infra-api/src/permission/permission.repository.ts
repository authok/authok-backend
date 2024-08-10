import { Page } from 'libs/common/src/pagination/pagination.model';
import { PermissionModel, PermissionPageQuery } from './permission.model';
import { IContext } from '@libs/nest-core';

export interface IPermissionRepository {
  paginate(
    ctx: IContext,
    query: PermissionPageQuery,
  ): Promise<Page<PermissionModel>>;
}
