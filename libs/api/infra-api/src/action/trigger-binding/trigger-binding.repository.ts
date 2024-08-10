import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";
import { TriggerBindingModel, UpdateTriggerBindingModel } from "./trigger-binding.model";
import { IContext } from "@libs/nest-core";

export interface ITriggerBindingRepository {
  update(ctx: IContext, trigger_id: string, bindings: UpdateTriggerBindingModel[]): Promise<TriggerBindingModel[]>;

  paginate(ctx: IContext, query: PageQuery): Promise<Page<TriggerBindingModel>>;
}