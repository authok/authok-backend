import { IContext, IRequestContext } from "@libs/nest-core";
import { GroupModel } from "./group.model";
import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";

export interface IGroupService {
  create(ctx: IContext, group: Partial<GroupModel>): Promise<GroupModel>;

  retrieve(ctx: IContext, id: string): Promise<GroupModel | undefined>;

  update(ctx: IContext, group: Partial<GroupModel>): Promise<GroupModel>;

  delete(ctx: IContext, id: string): Promise<void>;

  paginate(ctx: IContext, query: PageQuery): Promise<Page<GroupModel>>;

  findByOuterId(ctx: IContext, type: string, outer_id: string): Promise<GroupModel | undefined>;
}