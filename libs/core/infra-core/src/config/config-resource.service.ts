import { Injectable, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { 
  IConfigService,
  IConfigResourceService,
} from 'libs/api/infra-api/src';
import { IRequestContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination';

@Injectable()
export class ConfigResourceService<T = any> implements IConfigResourceService<T> {
  @Inject('IConfigService')
  private readonly configService: IConfigService;

  constructor(
    private readonly resource_name: string,
  ) {}

  async get(
    ctx: IRequestContext,
    name: string,
  ): Promise<T | undefined> {
    const config = await this.configService.get(ctx, this.resource_name, name);
    if (!config) return undefined;

    return {...config.value, updated_at: config.updated_at, created_at: config.created_at } as unknown as T;
  }

  async set(
    ctx: IRequestContext,
    name: string,
    data: T,
  ): Promise<T> {
    let config = await this.configService.get(ctx, this.resource_name, name);
    let value = data;
    if (config) {
      value = _.merge(config.value, data);
    } else {
      value = data;
    }

    const saved = await this.configService.set(ctx, this.resource_name, name, { value });

    return { ...saved.value, updated_at: saved.updated_at, created_at: saved.created_at } as unknown as T;
  }

  async delete(ctx: IRequestContext, name: string): Promise<void> {
    await this.configService.delete(ctx, this.resource_name, name);
  }

  async paginate(ctx: IRequestContext, query: PageQuery): Promise<Page<T>> {
    const page = await this.configService.paginate(ctx, {...query, namespace: this.resource_name }); 
    return {
      meta: page.meta,
      items: page.items.map(it => ({ ...it.value, updated_at: it.updated_at, created_at: it.created_at } as unknown as T))
    }
  }
}