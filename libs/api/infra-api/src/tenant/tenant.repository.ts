import { TenantModel, UpdateTenantModel, CreateTenantModel } from './tenant.model';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export interface ITenantRepository {
  retrieve(ctx: IContext, id: string): Promise<TenantModel | undefined>;

  update(
    ctx: IContext,
    id: string,
    body: Partial<UpdateTenantModel>,
  ): Promise<TenantModel>;

  delete(ctx: IContext, id: string): Promise<{ affected?: number }>;

  findByName(ctx: IContext, name: string): Promise<TenantModel | undefined>;

  create(ctx: IContext, tenant: CreateTenantModel): Promise<TenantModel>;

  paginate(ctx: IContext, query: PageQuery): Promise<Page<TenantModel>>;
}
