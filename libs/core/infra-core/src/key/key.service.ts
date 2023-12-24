import { Injectable, NotFoundException, Inject } from '@nestjs/common';

import { IKeyService } from 'libs/api/infra-api/src/key/key.service';
import {
  CreateKeyDto,
  KeyDto,
  UpdateKeyDto,
} from 'libs/api/infra-api/src/key/key.dto';
import { IKeyRepository } from 'libs/api/infra-api/src/key/key.repository';
import { IRequestContext } from '@libs/nest-core';

@Injectable()
export class KeyService implements IKeyService {
  constructor(
    @Inject('IKeyRepository')
    private readonly keyRepository: IKeyRepository,
  ) {}

  async retrieve(ctx: IRequestContext, id: string): Promise<KeyDto | null> {
    return await this.keyRepository.retrieve(ctx, id);
  }

  async findActiveKey(ctx: IRequestContext): Promise<KeyDto> {
    return this.keyRepository.findActiveKey(ctx);
  }

  findByIds(ctx: IRequestContext, ids: string[]): Promise<KeyDto[]> {
    return this.keyRepository.findByIds(ctx, ids);
  }

  async delete(ctx: IRequestContext, id: string) {
    this.keyRepository.delete(ctx, id);
  }

  async create(ctx: IRequestContext, key: CreateKeyDto): Promise<KeyDto> {
    return await this.keyRepository.create(ctx, key);
  }

  async findAll(ctx: IRequestContext): Promise<KeyDto[]> {
    return await this.keyRepository.findAll(ctx);
  }

  async update(
    ctx: IRequestContext,
    id: string,
    data: UpdateKeyDto,
  ): Promise<KeyDto> {
    const update = await this.keyRepository.update(ctx, id, data);

    if (update.affected) {
      return await this.keyRepository.retrieve(ctx, id);
    } else {
      throw new NotFoundException(`Key : ${id} not found!`);
    }
  }

  async rotate(ctx: IRequestContext): Promise<KeyDto> {
    return await this.keyRepository.rotate(ctx);
  }
}
