import { IRequestContext } from "@libs/nest-core";
import { Config } from "./config.model";
import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";

export interface IConfigRepository {
  get(ctx: IRequestContext, namespace: string, name: string): Promise<Config | undefined>;

  set(ctx: IRequestContext, namespace: string, name: string, config: Config): Promise<Config>;

  delete(ctx: IRequestContext, namespace: string, name: string): Promise<void>;

  paginate(
    ctx: IRequestContext,
    query: PageQuery,
  ): Promise<Page<Config>>;
}