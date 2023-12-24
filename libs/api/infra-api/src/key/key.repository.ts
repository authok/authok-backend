import { KeyDto, UpdateKeyDto, CreateKeyDto } from './key.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { IRequestContext } from '@libs/nest-core';

export interface IKeyRepository {
  retrieve(ctx: IRequestContext, id: string): Promise<KeyDto | undefined>;

  findActiveKey(ctx: IRequestContext): Promise<KeyDto | undefined>;

  findByIds(ctx: IRequestContext, ids: string[]): Promise<KeyDto[]>;

  update(
    ctx: IRequestContext,
    id: string,
    data: UpdateKeyDto,
  ): Promise<UpdateResult>;

  delete(ctx: IRequestContext, id: string): Promise<DeleteResult>;

  create(ctx: IRequestContext, key: CreateKeyDto): Promise<KeyDto>;

  findAll(ctx: IRequestContext): Promise<KeyDto[]>;

  rotate(ctx: IRequestContext): Promise<KeyDto>;
}
