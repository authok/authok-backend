import { IContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';

export interface IConfigResourceService<T> {
  get(
    ctx: IContext,
    name: string,
  ): Promise<T | undefined>;

  set(
    ctx: IContext,
    name: string,
    data: T,
  ): Promise<T>;

  delete(ctx: IContext, name: string): Promise<void>;

  paginate(ctx: IContext, query: PageQuery): Promise<Page<T>>;
}
