import {
  ConnectionModel,
  CreateConnectionModel,
  UpdateConnectionModel,
} from './connection.model';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export interface IConnectionRepository {
  findByName(
    ctx: IContext,
    name: string,
  ): Promise<ConnectionModel | undefined>;

  retrieve(
    ctx: IContext,
    id: string,
  ): Promise<ConnectionModel | undefined>;

  create(
    ctx: IContext,
    input: CreateConnectionModel,
  ): Promise<ConnectionModel>;

  update(
    ctx: IContext,
    id: string,
    input: UpdateConnectionModel,
  ): Promise<void>;

  delete(ctx: IContext, id: string): Promise<{ affected?: number }>;

  paginate(
    ctx: IContext,
    page: PageQuery,
  ): Promise<Page<ConnectionModel>>;
}
