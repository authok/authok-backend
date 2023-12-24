import { IRequestContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';

export interface IConfigResourceService<T> {
  get(
    ctx: IRequestContext,
    name: string,
  ): Promise<T | undefined>;

  set(
    ctx: IRequestContext,
    name: string,
    data: T,
  ): Promise<T>;

  delete(ctx: IRequestContext, name: string): Promise<void>;

  paginate(ctx: IRequestContext, query: PageQuery): Promise<Page<T>>;
}
