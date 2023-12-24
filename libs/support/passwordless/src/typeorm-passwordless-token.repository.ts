import { Logger, Injectable } from '@nestjs/common';
import { IPasswordlessTokenRepository } from './passwordless-token.repository';
import { plainToClass } from 'class-transformer';
import {
  DefaultRandomStringGenerator,
  RandomStringGenerator,
  RandomStringType,
} from './random-string.generator';
import { TenantAwareRepository } from 'libs/support/tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { PasswordlessToken } from './passwordless-token.entity';
import { IRequestContext } from '@libs/nest-core';
import { Token } from './token';

const TOKEN_LENGTH = 6;

@Injectable()
export class TypeOrmPasswordlessTokenRepository
  extends TenantAwareRepository
  implements IPasswordlessTokenRepository {
  private tokenGenerator: RandomStringGenerator = new DefaultRandomStringGenerator();

  createToken(scene: string, key: string): Token {
    const value =  this.tokenGenerator.generate(TOKEN_LENGTH, RandomStringType.NUMBER);
    return { scene, key, value, created_at: new Date() } as Token;
  }

  async findToken(
    ctx: IRequestContext,
    scene: string,
    key: string,
  ): Promise<Token | undefined> {
    const repo = await this.repo(ctx, PasswordlessToken);

    const token = await repo.findOne({
      scene,
      key,
    });
    if (!token) return null;

    const now = new Date();
    if (now > token.expired_at) {
      Logger.warn(`Token [${token}] has expired`);
      return null;
    }

    Logger.debug(`Located token ${token}`);

    return token;
  }

  async deleteToken(ctx: IRequestContext, scene: string, key: string): Promise<void> {
    const repo = await this.repo(ctx, PasswordlessToken);

    await repo
      .createQueryBuilder()
      .delete()
      .from(PasswordlessToken)
      .where('scene = :scene AND key = :key', {
        scene,
        key,
      })
      .execute();
  }

  async saveToken(
    ctx: IRequestContext,
    token: Token,
  ): Promise<void> {
    const repo = await this.repo(ctx, PasswordlessToken);

    await repo.save(plainToClass(PasswordlessToken, token));
  }

  async clean(ctx: IRequestContext): Promise<void> {
    // TODO
  }
}
