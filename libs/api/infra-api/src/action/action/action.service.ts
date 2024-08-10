import { ActionModel } from './action.model';
import { IContext } from "@libs/nest-core";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";

export interface IActionService { 
  create(ctx: IContext, action: Partial<ActionModel>): Promise<ActionModel>;

  retrieve(ctx: IContext, id: string): Promise<ActionModel | undefined>;

  update(ctx: IContext, action: Partial<ActionModel>): Promise<ActionModel>;

  delete(ctx: IContext, id: string): Promise<void>;

  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<ActionModel>>;
}