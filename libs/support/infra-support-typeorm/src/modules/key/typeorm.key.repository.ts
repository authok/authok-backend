import { KeyEntity } from './key.entity';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { DeleteResult, UpdateResult, EntityManager, In } from 'typeorm';
import {
  KeyModel,
  UpdateKeyModel,
  CreateKeyModel,
  IKeyRepository,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { SigningKeyGenerator } from 'libs/shared/src/key-generator/key.generator';
import * as _ from 'lodash';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TypeOrmKeyRepository
  extends TenantAwareRepository
  implements IKeyRepository {

  @Inject()
  private readonly signingKeyGenerator: SigningKeyGenerator;

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<KeyModel | undefined> {
    const repo = await this.repo(ctx, KeyEntity);
    return await repo.findOne({
      where: {
        kid: id,
      }
    });
  }

  async findActiveKey(ctx: IContext): Promise<KeyModel | undefined> {
    const repo = await this.repo(ctx, KeyEntity);
    return await repo.findOne({
      where: {
        tenant: ctx.tenant,
        current: true,
      },
    });
  }

  async findByIds(ctx: IContext, ids: string[]): Promise<KeyModel[]> {
    const repo = await this.repo(ctx, KeyEntity);

    return repo.findBy({
      kid: In(ids),
      tenant: ctx.tenant,
    });
  }

  async update(
    ctx: IContext,
    id: string,
    data: UpdateKeyModel,
  ): Promise<UpdateResult> {
    const repo = await this.repo(ctx, KeyEntity);

    return repo.update({ kid: id, tenant: ctx.tenant }, data);
  }

  async delete(ctx: IContext, id: string): Promise<DeleteResult> {
    const repo = await this.repo(ctx, KeyEntity);

    return repo.softDelete(id);
  }

  async create(ctx: IContext, _key: CreateKeyModel): Promise<KeyModel> {
    const repo = await this.repo(ctx, KeyEntity);

    const key = repo.create({ ..._key, tenant: ctx.tenant });
    return repo.save(key);
  }

  async findAll(ctx: IContext): Promise<KeyModel[]> {
    const repo = await this.repo(ctx, KeyEntity);

    return repo.find({
      where: {
        tenant: ctx.tenant,
      },
      take: 100,
      order: {
        updated_at: 'DESC',
      }
    });
  }

  async rotate(ctx: IContext): Promise<KeyModel> {
    const manager = await this.getManager(ctx);

    const attrs = [
      { name: 'commonName', value: ctx.tenant },
      { name:'countryName', value: 'zh' },
      { shortName: 'ST', value: ctx.tenant },
      { name:'localityName', value: 'shenzhen' },
      { name:'organizationName', value: ctx.tenant },
    ];

    const now = new Date();
    const nextKey = await manager.transaction(async (entityManager: EntityManager) => {
      const currentKeys = await entityManager.find(KeyEntity, {
        where: {
          tenant: ctx.tenant,
        },
        take: 100,
        order: {
          updated_at: 'DESC',
        }
      });

      const [needSave, needRemove] = _.chunk(currentKeys, 9);

      let findNext = false;
      for (const key of needSave) {
        console.log('key: ', key);
        if (key.next) {
          Logger.debug('找到 next');
          findNext = true;
          key.next = null;
          key.previous = null;
          key.current = true;
        } else if (key.current) {
          Logger.debug('找到 current');
          key.current = null;
          key.next = null;
          key.previous = true;
        } else if (key.previous) {
          Logger.debug('找到 previous');
          key.previous = null;
          key.next = null;
          key.current = null;
          key.revoked = true;
          key.revokedAt = now;
        }
      }

      // 如果没有找到下一个key, 则生成一个
      if (!findNext) {
        const currentKey = await this.signingKeyGenerator.generateSigningKey('RS256', attrs);
        currentKey.current = true;
        currentKey.tenant = ctx.tenant;
        needSave.push(plainToClass(KeyEntity, currentKey));
      }

      const nextKey = await this.signingKeyGenerator.generateSigningKey('RS256', attrs);
      nextKey.next = true;
      nextKey.tenant = ctx.tenant;
      needSave.push(plainToClass(KeyEntity, nextKey));

      if (needRemove && needRemove.length > 0) {
        await entityManager.remove(needRemove);
      }

      await entityManager.save(needSave);
      return nextKey;
    });

    return nextKey;
  }
}
