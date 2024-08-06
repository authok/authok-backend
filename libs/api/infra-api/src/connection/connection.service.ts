import {
  ConnectionModel,
  CreateConnectionModel,
  UpdateConnectionModel,
} from './connection.model';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export interface IConnectionService {
  findByName(ctx: IContext, name: string): Promise<ConnectionModel | null>;

  retrieve(ctx: IContext, id: string): Promise<ConnectionModel | null>;

  create(
    ctx: IContext,
    input: CreateConnectionModel,
  ): Promise<ConnectionModel | null>;

  update(
    ctx: IContext,
    id: string,
    input: UpdateConnectionModel,
  ): Promise<ConnectionModel | null>;

  delete(ctx: IContext, id: string);

  paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<ConnectionModel>>;
}
