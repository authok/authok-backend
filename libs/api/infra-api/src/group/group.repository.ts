import { IContext, IRequestContext } from "@libs/nest-core";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { GroupModel } from "./group.model";

export interface IGroupRepository {
  create(ctx: IContext, group: Partial<GroupModel>): Promise<GroupModel>;

  retrieve(ctx: IContext, id: string): Promise<GroupModel | undefined>;

  update(ctx: IContext, group: Partial<GroupModel>): Promise<GroupModel>;

  delete(ctx: IRequestContext, id: string): Promise<void>;

  paginate(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<GroupModel>>;

  findByOuterId(ctx: IRequestContext, type: string, outer_id: string): Promise<GroupModel | undefined>;
}