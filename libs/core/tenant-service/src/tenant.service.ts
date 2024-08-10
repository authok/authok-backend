import { Injectable, Inject, ConflictException } from '@nestjs/common';

import {
  ITenantService,
  ITenantRepository,
  TenantModel,
  UpdateTenantModel,
  CreateTenantModel,
} from 'libs/api/infra-api/src';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

const defaultJwtConfiguration = {
  alg: 'HS256',
  lifetime_in_seconds: 36000,
  secret_encoded: true,
  scopes: {},
};

@Injectable()
export class TenantService implements ITenantService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject('ITenantRepository')
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async retrieve(ctx: IContext, id: string): Promise<TenantModel | null> {
    return await this.tenantRepository.retrieve(ctx, id);
  }

  async findByName(
    ctx: IContext,
    name: string,
  ): Promise<TenantModel | null> {
    return await this.tenantRepository.findByName(ctx, name);
  }

  async delete(ctx: IContext, id: string) {
    this.tenantRepository.delete(ctx, id);
  }

  async create(
    ctx: IContext,
    _tenant: CreateTenantModel,
  ): Promise<TenantModel> {
    const existingTenant = await this.tenantRepository.findByName(
      ctx,
      _tenant.name,
    );

    if (existingTenant) {
      throw new ConflictException(`Tenant ${_tenant.name} already exists`);
    }
    console.log('准备创建租户');

    const tenant = await this.tenantRepository.create(ctx, {
      ..._tenant,
      jwt_configuration: defaultJwtConfiguration,
    });
    console.log('发送租户创建成功事件');
    this.eventEmitter.emit('tenant.created', {
      id: tenant.id,
      creator: ctx.req?.user,
    });

    return tenant;
  }

  async update(
    ctx: IContext,
    id: string,
    data: Partial<UpdateTenantModel>,
  ): Promise<TenantModel> {
    return await this.tenantRepository.update(ctx, id, data);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<TenantModel>> {
    return await this.tenantRepository.paginate(ctx, query);
  }
}