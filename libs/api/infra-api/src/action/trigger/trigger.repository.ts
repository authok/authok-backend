import { TriggerModel } from "./trigger.model";
import { IContext } from "@libs/nest-core";
import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";

export interface ITriggerRepository { 
  create(ctx: IContext, trigger: TriggerModel): Promise<TriggerModel>;

  retrieve(ctx: IContext, id: string): Promise<TriggerModel | undefined>;

  update(ctx: IContext, trigger: Partial<TriggerModel>): Promise<TriggerModel>;

  delete(ctx: IContext, id: string): Promise<void>;

  paginate(ctx: IContext, query: PageQuery): Promise<Page<TriggerModel>>;
}