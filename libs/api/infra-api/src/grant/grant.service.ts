import { IContext } from "@libs/nest-core";
import { GrantModel } from "./grant.model";
import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";

export interface IGrantService {
  retrieve(ctx: IContext, id: string): Promise<GrantModel | undefined>;

  update(ctx: IContext, grant: Partial<GrantModel>): Promise<GrantModel>;

  create(ctx: IContext, grant: Partial<GrantModel>): Promise<GrantModel>;

  delete(ctx: IContext, id: string): Promise<void>;

  deleteByUserId(ctx: IContext, user_id: string): Promise<void>;

  paginate(ctx: IContext, query: PageQuery): Promise<Page<GrantModel>>;
}