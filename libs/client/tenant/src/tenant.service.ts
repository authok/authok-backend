import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import {
  ITenantService,
  TenantModel,
  UpdateTenantModel,
  CreateTenantModel,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { ClientGrpc } from '@nestjs/microservices';
import { TENANT_SERVICE_NAME, Tenant, TenantServiceClient } from 'proto/stub/tenant/tenant.pb';
import { handleRpcException } from './utils';
import { Page, PageQuery } from 'libs/common/src/pagination';

const defaultJwtConfiguration = {
  alg: 'HS256',
  lifetime_in_seconds: 36000,
  secret_encoded: true,
  scopes: {},
};

@Injectable()
export class TenantService implements ITenantService, OnModuleInit {
  private tenantServiceClient: TenantServiceClient;

  constructor(
    @Inject('tenant_grpc_client') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.tenantServiceClient = this.grpcClient.getService<TenantServiceClient>(TENANT_SERVICE_NAME);
  }

  async retrieve(ctx: IContext, id: string): Promise<TenantModel | null> {
    const pbTenant = await handleRpcException<Tenant>(
      this.tenantServiceClient.retrieve({
        id,
      }).toPromise(),
    );
    if (!pbTenant) return undefined;

    return {
      id: pbTenant.id,
      name: pbTenant.name,
      display_name: pbTenant.displayName,
      description: pbTenant.description,
      region: pbTenant.region,
      environment: pbTenant.environment,
      jwt_configuration: JSON.parse(pbTenant.jwtConfiguration ?? '{}'),
    }
  }

  async findByName(
    ctx: IContext,
    name: string,
  ): Promise<TenantModel | null> {
    const pbTenant = await handleRpcException<Tenant>(
      this.tenantServiceClient.findByName({
        name,
      }).toPromise(),
    )
    if (!pbTenant) return undefined;

    return {
      id: pbTenant.id,
      name: pbTenant.name,
      display_name: pbTenant.displayName,
      description: pbTenant.description,
      region: pbTenant.region,
      environment: pbTenant.environment,
      jwt_configuration: JSON.parse(pbTenant.jwtConfiguration ?? '{}'),
    }
  }

  async delete(ctx: IContext, id: string) {
    return await this.tenantServiceClient.delete({
      id,
    }).toPromise() as any;
  }

  async create(
    ctx: IContext,
    data: CreateTenantModel,
  ): Promise<TenantModel> {
    const pbTenant = await this.tenantServiceClient.create({
      name: data.name,
      displayName: data.display_name,
      description: data.description,
      region: data.region,
      environment: data.environment,
      jwtConfiguration: JSON.stringify(data.jwt_configuration ?? defaultJwtConfiguration),
    }).toPromise() as any;

    return {
      id: pbTenant.id,
      name: pbTenant.name,
      display_name: pbTenant.displayName,
      description: pbTenant.description,
      region: pbTenant.region,
      environment: pbTenant.environment,
      jwt_configuration: JSON.parse(pbTenant.jwtConfiguration ?? '{}'),
    };
  }

  async update(
    ctx: IContext,
    id: string,
    data: Partial<UpdateTenantModel>,
  ): Promise<TenantModel> {
    const pbTenant = this.tenantServiceClient.update({
      id,
      name: data.name,
      displayName: data.display_name,
      description: data.description,
      region: data.region,
      environment: data.environment,
      jwtConfiguration: JSON.stringify(data.jwt_configuration ?? {}),
    } as any).toPromise() as any;

    return {
      id: pbTenant.id,
      name: pbTenant.name,
      display_name: pbTenant.displayName,
      description: pbTenant.description,
      region: pbTenant.region,
      environment: pbTenant.environment,
      jwt_configuration: JSON.parse(pbTenant.jwtConfiguration ?? '{}'),
    };
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<TenantModel>> {
    const { meta, items: _items = [] } = await this.tenantServiceClient.list({
      q: query.q,
      page: query.page,
      perPage: query.per_page,
      sort: query.sort,
      includeTotals: query.include_totals,
      includeFields: query.include_fields,
    } as any).toPromise();

    const items = _items.map(pbTenant => ({
      id: pbTenant.id,
      name: pbTenant.name,
      display_name: pbTenant.displayName,
      description: pbTenant.description,
      region: pbTenant.region,
      environment: pbTenant.environment,
      jwt_configuration: JSON.parse(pbTenant.jwtConfiguration ?? '{}'),  
    }))

    return {
      meta: {
        page: meta.page,
        per_page: meta.perPage,
        total: meta.total,
      },
      items,
    };
  }
}
