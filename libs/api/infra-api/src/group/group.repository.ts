import { IRequestContext } from "@libs/nest-core";
import { IGroup } from "./group";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";

export interface IGroupRepository {
  create(ctx: IRequestContext, group: Partial<IGroup>): Promise<IGroup>;

  retrieve(ctx: IRequestContext, id: string): Promise<IGroup | undefined>;

  update(ctx: IRequestContext, group: Partial<IGroup>): Promise<IGroup>;

  delete(ctx: IRequestContext, id: string): Promise<void>;

  paginate(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<IGroup>>;

  findByOuterId(ctx: IRequestContext, type: string, outer_id: string): Promise<IGroup | undefined>;
}