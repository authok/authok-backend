import { Inject, Injectable } from '@nestjs/common';
import {
  PermissionModel,
  PermissionPageQuery,
} from 'libs/api/infra-api/src/permission/permission.model';
import { IPermissionRepository } from 'libs/api/infra-api/src/permission/permission.repository';
import { IPermissionService } from 'libs/api/infra-api/src/permission/permission.service';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IContext, IRequestContext } from '@libs/nest-core';

@Injectable()
export class PermissionService implements IPermissionService {
  constructor(
    @Inject('IPermissionRepository')
    private readonly repo: IPermissionRepository,
  ) {}
  async paginate(
    ctx: IContext,
    query: PermissionPageQuery,
  ): Promise<PageDto<PermissionModel>> {
    return await this.repo.paginate(ctx, query);
  }
}
