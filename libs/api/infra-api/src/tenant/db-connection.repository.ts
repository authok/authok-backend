import { IContext } from '@libs/nest-core';
import { DBConnectionModel } from './db-connection.model';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export interface IDBConnectionRepository {
  retrieve(
    ctx: IContext,
    id: string,
  ): Promise<DBConnectionModel | undefined>;

  update(
    ctx: IContext,
    id: string,
    body: Partial<DBConnectionModel>,
  ): Promise<{ affected?: number }>;

  delete(ctx: IContext, id: string): Promise<{ affected?: number }>;

  create(ctx: IContext, conn: DBConnectionModel): Promise<DBConnectionModel>;

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<DBConnectionModel>>;
}
