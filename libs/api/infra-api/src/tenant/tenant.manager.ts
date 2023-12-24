import { CreateTenantDto, TenantDto } from "./tenant.dto";
import { IContext } from "@libs/nest-core";

export interface ITenantManager {
  create(
    ctx: IContext,
    _tenant: CreateTenantDto,
  ): Promise<TenantDto>;
}