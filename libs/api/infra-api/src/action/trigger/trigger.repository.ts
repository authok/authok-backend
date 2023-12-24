import { TriggerDto } from "./trigger.dto";
import { IRequestContext } from "@libs/nest-core";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";

export interface ITriggerRepository { 
  create(ctx: IRequestContext, trigger: TriggerDto): Promise<TriggerDto>;

  retrieve(ctx: IRequestContext, id: string): Promise<TriggerDto | undefined>;

  update(ctx: IRequestContext, trigger: Partial<TriggerDto>): Promise<TriggerDto>;

  delete(ctx: IRequestContext, id: string): Promise<void>;

  paginate(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<TriggerDto>>;
}