import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';
import { ITenantService } from 'libs/api/infra-api/src/tenant/tenant.service';
import {
  TenantDto,
  CreateTenantDto,
  UpdateTenantDto,
} from 'libs/api/infra-api/src/tenant/tenant.dto';
import { IRequestContext } from '@libs/nest-core';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

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
    ctx: IRequestContext,
    name: string,
  ): Promise<TenantDto | null> {
    return await this.promisifyHttp.get(
      `${this.serviceBaseUrl}/tenants/findByName/${name}`,
      {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async retrieve(ctx: IRequestContext, id: string): Promise<TenantDto | null> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/tenants/${id}`, {
        headers: {
          tenant: ctx.tenant,
        },
      },
    );
  }

  async create(
    ctx: IRequestContext,
    tenant: CreateTenantDto,
  ): Promise<TenantDto | null> {
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
    ctx: IRequestContext,
    id: string,
    data: UpdateTenantDto,
  ): Promise<TenantDto | null> {
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

  async delete(ctx: IRequestContext, id: string) {
    await this.promisifyHttp.delete(`${this.serviceBaseUrl}/tenants/${id}`, {
      headers: {
        tenant: ctx.tenant,
      },
    });
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<TenantDto>> {
    return await this.promisifyHttp.get(`${this.serviceBaseUrl}/tenants`, {
      params: query,
      headers: {
        tenant: ctx.tenant,
      },
    });
  }
}
