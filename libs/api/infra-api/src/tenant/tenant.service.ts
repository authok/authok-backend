import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';
import { TenantDto, CreateTenantDto, UpdateTenantDto } from './tenant.dto';

export interface ITenantService {
  findByName(ctx: IRequestContext, name: string): Promise<TenantDto | null>;

  retrieve(ctx: IRequestContext, id: string): Promise<TenantDto | null>;

  create(
    ctx: IRequestContext,
    tenant: CreateTenantDto,
  ): Promise<TenantDto | null>;

  update(
    ctx: IRequestContext,
    tenant: string,
    data: UpdateTenantDto,
  ): Promise<TenantDto | null>;

  delete(ctx: IRequestContext, id: string);

  paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<TenantDto>>;
}
