import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConnectionModel,
  CreateConnectionModel,
  UpdateConnectionModel,
  IConnectionService,
  ConnectionPageQuery,
} from 'libs/api/infra-api/src';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IContext } from '@libs/nest-core';
import { Page } from 'libs/common/src/pagination';

@Injectable()
export class RestfulConnectionService implements IConnectionService {
  private serviceBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly promisifyHttp: PromisifyHttpService,
  ) {
    this.serviceBaseUrl = this.configService.get<string>('services.baseUrl');
  }

  async findByName(
    ctx: IContext,
    name: string,
  ): Promise<ConnectionModel | null> {
    // TODO 从微服务获取数据
    const url = `${this.serviceBaseUrl}/connections/findByName/${name}`;
    const connection = await this.promisifyHttp.get(url, {
      headers: {
        tenant: ctx.tenant,
      },
    });
    return connection;
  }

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<ConnectionModel | null> {
    // TODO 从微服务获取数据
    const url = `${this.serviceBaseUrl}/connections/${id}`;
    const connection = await this.promisifyHttp.get(url, {
      headers: {
        tenant: ctx.tenant,
      },
    });
    return connection;
  }

  async create(
    ctx: IContext,
    input: CreateConnectionModel,
  ): Promise<ConnectionModel | null> {
    // TODO rest 远程调用 微服务 进行处理
    const url = `${this.serviceBaseUrl}/connections`;
    const connection = await this.promisifyHttp.post(url, input, {
      headers: {
        tenant: ctx.tenant,
      },
    });
    return connection;
  }

  async update(
    ctx: IContext,
    id: string,
    data: UpdateConnectionModel,
  ): Promise<ConnectionModel | null> {
    // TODO rest 远程调用 微服务 进行处理  // 有问题
    const url = `${this.serviceBaseUrl}/connections/${id}`;
    const connection = await this.promisifyHttp.patch(url, data, {
      headers: {
        tenant: ctx.tenant,
      },
    });
    return connection;
  }

  async delete(ctx: IContext, id: string) {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/connections/${id}`, {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async paginate(
    ctx: IContext,
    query: ConnectionPageQuery,
  ): Promise<Page<ConnectionModel>> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/connections`, {
      params: query,
      headers: {
        tenant: ctx.tenant,
      },
    });
  }
}
