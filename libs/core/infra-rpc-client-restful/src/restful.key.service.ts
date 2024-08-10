import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import {
  IKeyService,
  CreateKeyModel,
  KeyModel,
  UpdateKeyModel,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class RestfulKeyService implements IKeyService {
  private serviceBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly promisifyHttp: PromisifyHttpService,
  ) {
    this.serviceBaseUrl = this.configService.get<string>('services.baseUrl');
  }

  async retrieve(ctx: IContext, id: string): Promise<KeyModel | undefined> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/key/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async findByIds(ctx: IContext, ids: string[]): Promise<KeyModel[]> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/key/findByIds/${ids.join(',')}`,
      {
        headers: {
          tenant: ctx.tenant,
        },
      }
    );
  }

  async create(ctx: IContext, input: CreateKeyModel): Promise<KeyModel> {
    return await this.promisifyHttp.post(`${this.serviceBaseUrl}/key`, input, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async update(ctx: IContext, id: string, input: UpdateKeyModel): Promise<KeyModel> {
    return await this.promisifyHttp.patch(
      `${this.serviceBaseUrl}/key/${id}`,
      input,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async delete(ctx: IContext, id: string) {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/key/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async findActiveKey(ctx: IContext): Promise<KeyModel> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/key/findActiveKey`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<KeyModel>> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/keys`,
      {
        params: query,
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async findAll(ctx: IContext): Promise<KeyModel[]> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/keys/findAll`,
      {
        headers: {
          tenant: ctx.tenant,
        },
      }
    );
  }
}
