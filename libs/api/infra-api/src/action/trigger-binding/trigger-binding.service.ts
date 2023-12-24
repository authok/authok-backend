import { UpdateTriggerBindingDto, TriggerBindingDto } from "./trigger-binding.dto";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { IContext } from "@libs/nest-core";

export interface ITriggerBindingService { 
  update(ctx: IContext, trigger_id: string, bindings: UpdateTriggerBindingDto[]): Promise<TriggerBindingDto[]>;

  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<TriggerBindingDto>>;
}