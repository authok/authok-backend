import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import {
  ITenantService,
  TenantModel,
  CreateTenantModel,
  UpdateTenantModel,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class RestfulTenantService implements ITenantService {
  private serviceBaseUrl: string;

  constructor(
    private configService: ConfigService,
    private promisifyHttp: PromisifyHttpService,
  ) {
    this.serviceBaseUrl = this.configService.get<string>('services.baseUrl');
  }

  async findByName(
    ctx: IContext,
    name: string,
  ): Promise<TenantModel | null> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/tenants/findByName/${name}`,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async retrieve(ctx: IContext, id: string): Promise<TenantModel | null> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/tenants/${id}`, {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async create(
    ctx: IContext,
    tenant: CreateTenantModel,
  ): Promise<TenantModel | null> {
    return await this.promisifyHttp.post(
      `${this.serviceBaseUrl}/tenants`,
      tenant,
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
    data: UpdateTenantModel,
  ): Promise<TenantModel | null> {
    const user = await this.promisifyHttp.patch(
      `${this.serviceBaseUrl}/tenants/${id}`,
      data,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
    return user;
  }

  async delete(ctx: IContext, id: string) {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/tenants/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<TenantModel>> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/tenants`, {
      params: query,
      headers: {
        tenant: ctx.tenant,
      },
    });
  }
}
