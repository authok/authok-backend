// npm i ioredis@^4.0.0
import isEmpty from 'lodash/isEmpty';
import { RedisService } from '@authok/nestjs-redis';
import Redis from 'ioredis';
import { IModelAdapter } from './model.adapter';
import { Logger } from '@nestjs/common';

const consumable = new Set(['AuthorizationCode', 'RefreshToken', 'DeviceCode']);

function grantKeyFor(id) {
  return `grant:${id}`;
}

function userCodeKeyFor(userCode) {
  return `userCode:${userCode}`;
}

function uidKeyFor(uid) {
  return `uid:${uid}`;
}

const grantable = new Set([
  'AccessToken',
  'AuthorizationCode',
  'RefreshToken',
  'DeviceCode',
  'BackchannelAuthenticationRequest',
]);

export class RedisAdapter implements IModelAdapter {
  private client: Redis;

  constructor(
    private readonly name: string,
    private readonly redisService: RedisService,
  ) {
    this.client = this.redisService.getClient();
    Logger.debug(`RedisAdapter for ${name}`);
  }

  async upsert(ctx: Record<string, any>, id, payload, expiresIn) {
    // console.log('redis upsert: ', this.name, id, payload);

    const key = this.key(id);

    const multi = this.client.multi();
    if (consumable.has(this.name)) {
      multi.hmset(key, { payload: JSON.stringify(payload) });
    } else {
      multi.set(key, JSON.stringify(payload));
    }

    if (expiresIn) {
      multi.expire(key, expiresIn);
    }

    if (grantable.has(this.name) && payload.grantId) {
      const grantKey = grantKeyFor(payload.grantId);
      multi.rpush(grantKey, key);
      // if you're seeing grant key lists growing out of acceptable proportions consider using LTRIM
      // here to trim the list to an appropriate length
      const ttl = await this.client.ttl(grantKey);
      if (expiresIn > ttl) {
        multi.expire(grantKey, expiresIn);
      }
    }

    if (payload.userCode) {
      const userCodeKey = userCodeKeyFor(payload.userCode);
      multi.set(userCodeKey, id);
      multi.expire(userCodeKey, expiresIn);
    }

    if (payload.uid) {
      const uidKey = uidKeyFor(payload.uid);
      multi.set(uidKey, id);
      multi.expire(uidKey, expiresIn);
    }

    await multi.exec();
  }

  async find(ctx: Record<string, any>, id) {
    const data = consumable.has(this.name)
      ? await this.client.hgetall(this.key(id))
      : await this.client.get(this.key(id));

    if (isEmpty(data)) {
      return undefined;
    }

    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    const { payload, ...rest } = data;

    console.log('RedisAdaptor find: ', this.name, id, data);

    return {
      ...rest,
      ...JSON.parse(payload),
    };
  }

  async findByUid(ctx: Record<string, any>, uid) {
    console.log('redis findByUid');

    const id = await this.client.get(uidKeyFor(uid));
    return this.find(ctx, id);
  }

  async findByUserCode(ctx: Record<string, any>, userCode) {
    console.log('redis findByUserCode');

    const id = await this.client.get(userCodeKeyFor(userCode));
    return this.find(ctx, id);
  }

  async destroy(ctx: Record<string, any>, id) {
    console.log('redis destroy: ', this.name, id);

    const key = this.key(id);
    await this.client.del(key);
  }

  async revokeByGrantId(ctx: Record<string, any>, grantId) {
    console.log('redis revokeByGrantId');

    // eslint-disable-line class-methods-use-this
    const multi = this.client.multi();
    const tokens = await this.client.lrange(grantKeyFor(grantId), 0, -1);
    tokens.forEach((token) => multi.del(token));
    multi.del(grantKeyFor(grantId));
    await multi.exec();
  }

  async consume(ctx, id) {
    console.log('redis consume');

    await this.client.hset(
      this.key(id),
      'consumed',
      Math.floor(Date.now() / 1000),
    );
  }

  key(id) {
    return `${this.name}:${id}`;
  }
}
