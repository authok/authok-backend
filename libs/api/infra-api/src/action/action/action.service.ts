import { ActionDto } from './action.dto';
import { IRequestContext } from "@libs/nest-core";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";

export interface IActionService { 
  create(ctx: IRequestContext, action: Partial<ActionDto>): Promise<ActionDto>;

  retrieve(ctx: IRequestContext, id: string): Promise<ActionDto | undefined>;

  update(ctx: IRequestContext, action: Partial<ActionDto>): Promise<ActionDto>;

  delete(ctx: IRequestContext, id: string): Promise<void>;

  paginate(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<ActionDto>>;
}