import { Logger, Injectable } from '@nestjs/common';
import { IPasswordlessTokenRepository } from './passwordless-token.repository';
import { RedisService } from '@authok/nestjs-redis';
import { Redis } from 'ioredis';
import dayjs from 'dayjs';
import {
  RandomStringGenerator,
  DefaultRandomStringGenerator,
  RandomStringType,
} from './random-string.generator';
import { IRequestContext } from '@libs/nest-core';
import { Token } from './token';

const TOKEN_LENGTH = 6;

@Injectable()
export class RedisPasswordlessTokenRepository
  implements IPasswordlessTokenRepository {
  private tokenGenerator: RandomStringGenerator = new DefaultRandomStringGenerator();

  private client: Redis;

  constructor(private redisService: RedisService) {
    this.client = this.redisService.getClient();
  }

  private key(key: string) {
    return 'token:' + key;
  }

  createToken(scene: string, key: string): Token {
    const value = this.tokenGenerator.generate(TOKEN_LENGTH, RandomStringType.NUMBER);
    return { scene, key, value, created_at: new Date()} as Token;
  }

  async findToken(
    ctx: IRequestContext,
    scene,
    key: string,
  ): Promise<Token | undefined> {
    const data = await this.client.get(this.key(scene +':'+ key));
    if (!data) return null;

    const obj = JSON.parse(data) as any;

    Logger.debug(`Located token, key: ${key}, value:  ${obj.value}`);

    return {
      scene: obj.scene,
      key: obj.key,
      value: obj.value,
      expired_at: new Date(obj.expired_at),
      created_at: new Date(obj.created_at),
    };
  }

  async deleteToken(ctx: IRequestContext, scene: string, key: string): Promise<void> {
    await this.client.del(this.key(scene + ':' + key));
  }

  async saveToken(
    ctx: IRequestContext,
    token: Token,
  ): Promise<void> {
    const seconds = dayjs(token.expired_at).diff(dayjs(), 'second');
    console.log(`token: ${token.value} ${seconds} 秒后过期`, token);

    await this.client.set(
      this.key(token.scene + ':' + token.key),
      JSON.stringify(token),
      'EX',
      seconds,
    );
  }

  async clean(ctx: IRequestContext): Promise<void> {
    // TODO
  }
}
