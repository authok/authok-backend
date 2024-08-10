import { UpdateTriggerBindingModel, TriggerBindingModel } from "./trigger-binding.model";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { IContext } from "@libs/nest-core";

export interface ITriggerBindingService { 
  update(ctx: IContext, trigger_id: string, bindings: UpdateTriggerBindingModel[]): Promise<TriggerBindingModel[]>;

  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<TriggerBindingModel>>;
}