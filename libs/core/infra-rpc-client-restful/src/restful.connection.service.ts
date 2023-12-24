import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConnectionDto,
  CreateConnectionDto,
  UpdateConnectionDto,
  ConnectionPageQueryDto,
} from 'libs/api/infra-api/src/connection/connection.dto';
import { IConnectionService } from 'libs/api/infra-api/src/connection/connection.service';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IRequestContext } from '@libs/nest-core';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';

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
    ctx: IRequestContext,
    name: string,
  ): Promise<ConnectionDto | null> {
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
    ctx: IRequestContext,
    id: string,
  ): Promise<ConnectionDto | null> {
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
    ctx: IRequestContext,
    input: CreateConnectionDto,
  ): Promise<ConnectionDto | null> {
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
    ctx: IRequestContext,
    id: string,
    data: UpdateConnectionDto,
  ): Promise<ConnectionDto | null> {
    // TODO rest 远程调用 微服务 进行处理  // 有问题
    const url = `${this.serviceBaseUrl}/connections/${id}`;
    const connection = await this.promisifyHttp.patch(url, data, {
      headers: {
        tenant: ctx.tenant,
      },
    });
    return connection;
  }

  async delete(ctx: IRequestContext, id: string) {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/connections/${id}`, {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async paginate(
    ctx: IRequestContext,
    query: ConnectionPageQueryDto,
  ): Promise<PageDto<ConnectionDto>> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/connections`, {
      params: query,
      headers: {
        tenant: ctx.tenant,
      },
    });
  }
}
