import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientModel,
  CreateClientModel,
  UpdateClientModel,
  IClientService,
  ConnectionModel,
} from 'libs/api/infra-api/src';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class RestfulClientService implements IClientService {
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
  ): Promise<ClientModel | undefined> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/clients/name/${name}`,
      {
        headers: {
          tenant: ctx.tenant,
        }
      }
    );
  }

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<ClientModel | undefined> {
    // TODO 从微服务获取数据
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/clients/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async create(
    ctx: IContext,
    client: CreateClientModel,
  ): Promise<ClientModel> {
    return await this.promisifyHttp.post(
      `${this.serviceBaseUrl}/clients`,
      client,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async update(
    ctx: IContext,
    id: string,
    data: UpdateClientModel,
  ): Promise<ClientModel> {
    return await this.promisifyHttp.patch(
      `${this.serviceBaseUrl}/clients/${id}`,
      data,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async delete(ctx: IContext, id: string) {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/clients/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<ClientModel>> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/clients`, {
      params: query,
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async rotate(ctx: IContext, id: string): Promise<ClientModel> {
    return await this.promisifyHttp.patch(
      `${this.serviceBaseUrl}/clients/${id}/rotate`,
      {
        headers: {
          tenant: ctx.tenant,
        }
      },
    );
  }

  async findEnabledConnections(
    ctx: IContext,
    client_id: string,
  ): Promise<ConnectionModel[]> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/clients/${client_id}/enabled_connections`,
      {
        headers: {
          tenant: ctx.tenant,
        }
      },
    );
  }
}
