import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { PermissionModel, PermissionPageQuery } from './permission.model';
import { IContext } from '@libs/nest-core';

export interface IPermissionService {
  paginate(
    ctx: IContext,
    query: PermissionPageQuery,
  ): Promise<PageDto<PermissionModel>>;
}
