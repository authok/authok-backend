import { TenantDto, UpdateTenantDto, CreateTenantDto } from './tenant.dto';
import { IContext } from '@libs/nest-core';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';

export interface ITenantRepository {
  retrieve(ctx: IContext, id: string): Promise<TenantDto | undefined>;

  update(
    ctx: IContext,
    id: string,
    body: Partial<UpdateTenantDto>,
  ): Promise<TenantDto>;

  delete(ctx: IContext, id: string): Promise<{ affected?: number }>;

  findByName(ctx: IContext, name: string): Promise<TenantDto | undefined>;

  create(ctx: IContext, tenant: CreateTenantDto): Promise<TenantDto>;

  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<TenantDto>>;
}
