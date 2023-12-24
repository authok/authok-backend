import { TriggerBindingDto, UpdateTriggerBindingDto } from "./trigger-binding.dto";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { IContext } from "@libs/nest-core";

export interface ITriggerBindingRepository {
  update(ctx: IContext, trigger_id: string, bindings: UpdateTriggerBindingDto[]): Promise<TriggerBindingDto[]>;

  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<TriggerBindingDto>>;
}