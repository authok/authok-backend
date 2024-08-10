import { CreateTenantModel, TenantModel } from "./tenant.model";
import { IContext } from "@libs/nest-core";

export interface ITenantManager {
  create(
    ctx: IContext,
    _tenant: CreateTenantModel,
  ): Promise<TenantModel>;
}