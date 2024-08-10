import { IContext } from "@libs/nest-core";
import { ConfigModel } from "./config.model";
import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";

export interface IConfigRepository {
  get(ctx: IContext, namespace: string, name: string): Promise<ConfigModel | undefined>;

  set(ctx: IContext, namespace: string, name: string, config: ConfigModel): Promise<ConfigModel>;

  delete(ctx: IContext, namespace: string, name: string): Promise<void>;

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<ConfigModel>>;
}