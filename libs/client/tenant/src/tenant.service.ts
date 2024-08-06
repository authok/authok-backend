import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { ITenantService } from 'libs/api/infra-api/src/tenant/tenant.service';
import {
  TenantDto,
  UpdateTenantDto,
  CreateTenantDto,
} from 'libs/api/infra-api/src/tenant/tenant.dto';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';
import { ClientGrpc } from '@nestjs/microservices';
import { TENANT_SERVICE_NAME, TenantServiceClient } from 'proto/stub/tenant/tenant.pb';
import { firstValueFrom } from 'rxjs';
import replay_detection from '@authok/oidc-provider/lib/models/replay_detection';

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

  async retrieve(ctx: IRequestContext, id: string): Promise<TenantDto | null> {
    const s = this.tenantServiceClient.retrieve({
      id,
    })
  
    const reply = firstValueFrom(s);

    return reply as unknown as TenantDto;
  }

  async findByName(
    ctx: IRequestContext,
    name: string,
  ): Promise<TenantDto | null> {
    const s = this.tenantServiceClient.findByName({
      name,
    })
  
    const reply = firstValueFrom(s);

    return reply as unknown as TenantDto;
  }

  async delete(ctx: IRequestContext, id: string) {
    return null
  }

  async create(
    ctx: IRequestContext,
    _tenant: CreateTenantDto,
  ): Promise<TenantDto> {
    return null;
  }

  async update(
    ctx: IRequestContext,
    id: string,
    data: Partial<UpdateTenantDto>,
  ): Promise<TenantDto> {
    return null;
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<TenantDto>> {
    return null;
  }
}
