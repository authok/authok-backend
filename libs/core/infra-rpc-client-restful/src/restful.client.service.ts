import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientDto,
  CreateClientDto,
  UpdateClientDto,
} from 'libs/api/infra-api/src/client/client.dto';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IClientService } from 'libs/api/infra-api/src/client/client.service';
import { IRequestContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { ConnectionDto } from 'libs/api/infra-api/src/connection/connection.dto';

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
    ctx: IRequestContext,
    name: string,
  ): Promise<ClientDto | undefined> {
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
    ctx: IRequestContext,
    id: string,
  ): Promise<ClientDto | undefined> {
    // TODO 从微服务获取数据
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/clients/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async create(
    ctx: IRequestContext,
    client: CreateClientDto,
  ): Promise<ClientDto> {
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
    ctx: IRequestContext,
    id: string,
    data: UpdateClientDto,
  ): Promise<ClientDto> {
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

  async delete(ctx: IRequestContext, id: string) {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/clients/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<ClientDto>> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/clients`, {
      params: query,
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async rotate(ctx: IRequestContext, id: string): Promise<ClientDto> {
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
    ctx: IRequestContext,
    client_id: string,
  ): Promise<ConnectionDto[]> {
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
