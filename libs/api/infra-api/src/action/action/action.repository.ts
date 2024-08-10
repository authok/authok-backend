import { ActionModel } from './action.model';
import { IContext } from "@libs/nest-core";
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export interface IActionRepository { 
  create(ctx: IContext, action: ActionModel): Promise<ActionModel>;

  retrieve(ctx: IContext, id: string): Promise<ActionModel | undefined>;

  update(ctx: IContext, action: Partial<ActionModel>): Promise<ActionModel>;

  delete(ctx: IContext, id: string): Promise<void>;

  paginate(ctx: IContext, query: PageQuery): Promise<Page<ActionModel>>;
}