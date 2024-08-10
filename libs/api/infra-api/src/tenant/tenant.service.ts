import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { IContext } from '@libs/nest-core';
import { TenantModel, CreateTenantModel, UpdateTenantModel } from './tenant.model';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export interface ITenantService {
  findByName(ctx: IContext, name: string): Promise<TenantModel | null>;

  retrieve(ctx: IContext, id: string): Promise<TenantModel | null>;

  create(
    ctx: IContext,
    tenant: CreateTenantModel,
  ): Promise<TenantModel | null>;

  update(
    ctx: IContext,
    id: string,
    data: UpdateTenantModel,
  ): Promise<TenantModel | null>;

  delete(ctx: IContext, id: string);

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<TenantModel>>;
}
