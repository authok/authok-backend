import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { PermissionDto, PermissionPageQueryDto } from './permission.dto';
import { IRequestContext } from '@libs/nest-core';

export interface IPermissionRepository {
  paginate(
    ctx: IRequestContext,
    query: PermissionPageQueryDto,
  ): Promise<PageDto<PermissionDto>>;
}
