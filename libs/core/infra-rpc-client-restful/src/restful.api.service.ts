import { Injectable } from '@nestjs/common';

import {
  CreateResourceServerModel,
  ResourceServerModel,
  UpdateResourceServerModel,
  ResourceServerPageQuery,
  IResourceServerService,
} from 'libs/api/infra-api/src';
import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { IContext } from '@libs/nest-core';
import { Page } from 'libs/common/src/pagination';

@Injectable()
export class RestfulResourceServerService implements IResourceServerService {
  private serviceBaseUrl: string;

  constructor(
    private configService: ConfigService,
    private promisifyHttp: PromisifyHttpService,
  ) {
    this.serviceBaseUrl = this.configService.get<string>('services.baseUrl');
  }

  async retrieve(ctx: IContext, id: string): Promise<ResourceServerModel | null> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/resource-servers/${id}`);
  }

  async findByIdentifier(
    ctx: IContext,
    identifier: string,
  ): Promise<ResourceServerModel | null> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/resource-servers/findByIdentifier/${identifier}`);
  }

  async create(ctx: IContext, api: CreateResourceServerModel): Promise<ResourceServerModel> {
    return await this.promisifyHttp.post(`${this.serviceBaseUrl}/resource-servers`, api);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/resource-servers/${id}`);
  }

  async update(
    ctx: IContext,
    id: string,
    body: UpdateResourceServerModel,
  ): Promise<ResourceServerModel> {
    return await this.promisifyHttp.patch(
      `${this.serviceBaseUrl}/resource-servers/${id}`,
      body,
    );
  }

  async paginate(
    ctx: IContext,
    query: ResourceServerPageQuery,
  ): Promise<Page<ResourceServerModel>> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/resource-servers`, {
      params: query,
    });
  }
}
