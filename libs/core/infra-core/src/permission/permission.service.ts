import { Inject, Injectable } from '@nestjs/common';
import {
  PermissionDto,
  PermissionPageQueryDto,
} from 'libs/api/infra-api/src/permission/permission.dto';
import { IPermissionRepository } from 'libs/api/infra-api/src/permission/permission.repository';
import { IPermissionService } from 'libs/api/infra-api/src/permission/permission.service';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';

@Injectable()
export class PermissionService implements IPermissionService {
  constructor(
    @Inject('IPermissionRepository')
    private readonly repo: IPermissionRepository,
  ) {}
  async paginate(
    ctx: IRequestContext,
    query: PermissionPageQueryDto,
  ): Promise<PageDto<PermissionDto>> {
    return await this.repo.paginate(ctx, query);
  }
}
