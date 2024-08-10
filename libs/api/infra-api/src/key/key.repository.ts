import { KeyModel, UpdateKeyModel, CreateKeyModel } from './key.model';
import { UpdateResult, DeleteResult } from 'typeorm';
import { IContext } from '@libs/nest-core';

export interface IKeyRepository {
  retrieve(ctx: IContext, id: string): Promise<KeyModel | undefined>;

  findActiveKey(ctx: IContext): Promise<KeyModel | undefined>;

  findByIds(ctx: IContext, ids: string[]): Promise<KeyModel[]>;

  update(
    ctx: IContext,
    id: string,
    data: UpdateKeyModel,
  ): Promise<UpdateResult>;

  delete(ctx: IContext, id: string): Promise<DeleteResult>;

  create(ctx: IContext, key: CreateKeyModel): Promise<KeyModel>;

  findAll(ctx: IContext): Promise<KeyModel[]>;

  rotate(ctx: IContext): Promise<KeyModel>;
}
