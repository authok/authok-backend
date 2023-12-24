import { Injectable } from '@nestjs/common';

import {
  CreateResourceServerDto,
  ResourceServerDto,
  UpdateResourceServerDto,
  ResourceServerPageQueryDto,
} from 'libs/api/infra-api/src/resource-server/resource-server.dto';
import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IResourceServerService } from 'libs/api/infra-api/src/resource-server/resource-server.service';
import { IRequestContext } from '@libs/nest-core';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';

@Injectable()
export class RestfulResourceServerService implements IResourceServerService {
  private serviceBaseUrl: string;

  constructor(
    private configService: ConfigService,
    private promisifyHttp: PromisifyHttpService,
  ) {
    this.serviceBaseUrl = this.configService.get<string>('services.baseUrl');
  }

  async retrieve(ctx: IRequestContext, id: string): Promise<ResourceServerDto | null> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/resource-servers/${id}`);
  }

  async findByIdentifier(
    ctx: IRequestContext,
    identifier: string,
  ): Promise<ResourceServerDto | null> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/resource-servers/findByIdentifier/${identifier}`);
  }

  async create(ctx: IRequestContext, api: CreateResourceServerDto): Promise<ResourceServerDto> {
    return await this.promisifyHttp.post(`${this.serviceBaseUrl}/resource-servers`, api);
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/resource-servers/${id}`);
  }

  async update(
    ctx: IRequestContext,
    id: string,
    body: UpdateResourceServerDto,
  ): Promise<ResourceServerDto> {
    return await this.promisifyHttp.patch(
      `${this.serviceBaseUrl}/resource-servers/${id}`,
      body,
    );
  }

  async paginate(
    ctx: IRequestContext,
    query: ResourceServerPageQueryDto,
  ): Promise<PageDto<ResourceServerDto>> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/resource-servers`, {
      params: query,
    });
  }
}
