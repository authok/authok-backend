import { IRequestContext } from '@libs/nest-core';
import { KeyDto, CreateKeyDto, UpdateKeyDto } from './key.dto';

export interface IKeyService {
  retrieve(ctx: IRequestContext, id: string): Promise<KeyDto | null>;

  retrieve(ctx: IRequestContext, id: string): Promise<KeyDto | null>;

  findActiveKey(ctx: IRequestContext): Promise<KeyDto>;

  findByIds(ctx: IRequestContext, ids: string[]): Promise<KeyDto[]>;

  delete(ctx: IRequestContext, id: string);

  create(ctx: IRequestContext, key: CreateKeyDto): Promise<KeyDto>;

  update(ctx: IRequestContext, id: string, data: UpdateKeyDto): Promise<KeyDto>;

  findAll(ctx: IRequestContext): Promise<KeyDto[]>;

  rotate(ctx: IRequestContext): Promise<KeyDto>;
}
