import { TriggerDto } from "./trigger.dto";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { IContext } from "@libs/nest-core";
import { TriggerContext } from "./trigger.context";

export interface ITriggerService { 
  create(ctx: IContext, trigger: TriggerDto): Promise<TriggerDto>;

  retrieve(ctx: IContext, id: string): Promise<TriggerDto | undefined>;

  update(ctx: IContext, trigger: Partial<TriggerDto>): Promise<TriggerDto>;

  delete(ctx: IContext, id: string): Promise<void>;

  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<TriggerDto>>;

  trigger(ctx: IContext, triggerContext: TriggerContext): Promise<any>;
}