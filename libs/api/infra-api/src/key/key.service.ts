import { IContext } from '@libs/nest-core';
import { KeyModel, CreateKeyModel, UpdateKeyModel } from './key.model';

export interface IKeyService {
  retrieve(ctx: IContext, id: string): Promise<KeyModel | null>;

  retrieve(ctx: IContext, id: string): Promise<KeyModel | null>;

  findActiveKey(ctx: IContext): Promise<KeyModel>;

  findByIds(ctx: IContext, ids: string[]): Promise<KeyModel[]>;

  delete(ctx: IContext, id: string);

  create(ctx: IContext, key: CreateKeyModel): Promise<KeyModel>;

  update(ctx: IContext, id: string, data: UpdateKeyModel): Promise<KeyModel>;

  findAll(ctx: IContext): Promise<KeyModel[]>;

  rotate(ctx: IContext): Promise<KeyModel>;
}
