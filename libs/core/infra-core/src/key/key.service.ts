import { Injectable, NotFoundException, Inject } from '@nestjs/common';

import {
  IKeyService,
  IKeyRepository,
  CreateKeyModel,
  KeyModel,
  UpdateKeyModel,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';

@Injectable()
export class KeyService implements IKeyService {
  constructor(
    @Inject('IKeyRepository')
    private readonly keyRepository: IKeyRepository,
  ) {}

  async retrieve(ctx: IContext, id: string): Promise<KeyModel | null> {
    return await this.keyRepository.retrieve(ctx, id);
  }

  async findActiveKey(ctx: IContext): Promise<KeyModel> {
    return this.keyRepository.findActiveKey(ctx);
  }

  findByIds(ctx: IContext, ids: string[]): Promise<KeyModel[]> {
    return this.keyRepository.findByIds(ctx, ids);
  }

  async delete(ctx: IContext, id: string) {
    this.keyRepository.delete(ctx, id);
  }

  async create(ctx: IContext, key: CreateKeyModel): Promise<KeyModel> {
    return await this.keyRepository.create(ctx, key);
  }

  async findAll(ctx: IContext): Promise<KeyModel[]> {
    return await this.keyRepository.findAll(ctx);
  }

  async update(
    ctx: IContext,
    id: string,
    data: UpdateKeyModel,
  ): Promise<KeyModel> {
    const update = await this.keyRepository.update(ctx, id, data);

    if (update.affected) {
      return await this.keyRepository.retrieve(ctx, id);
    } else {
      throw new NotFoundException(`Key : ${id} not found!`);
    }
  }

  async rotate(ctx: IContext): Promise<KeyModel> {
    return await this.keyRepository.rotate(ctx);
  }
}