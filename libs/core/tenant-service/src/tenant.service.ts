import { Injectable, Inject, ConflictException } from '@nestjs/common';

import { ITenantService } from 'libs/api/infra-api/src/tenant/tenant.service';
import { ITenantRepository } from 'libs/api/infra-api/src/tenant/tenant.repository';
import {
  TenantDto,
  UpdateTenantDto,
  CreateTenantDto,
} from 'libs/api/infra-api/src/tenant/tenant.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';

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

  async retrieve(ctx: IRequestContext, id: string): Promise<TenantDto | null> {
    return await this.tenantRepository.retrieve(ctx, id);
  }

  async findByName(
    ctx: IRequestContext,
    name: string,
  ): Promise<TenantDto | null> {
    return await this.tenantRepository.findByName(ctx, name);
  }

  async delete(ctx: IRequestContext, id: string) {
    this.tenantRepository.delete(ctx, id);
  }

  async create(
    ctx: IRequestContext,
    _tenant: CreateTenantDto,
  ): Promise<TenantDto> {
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
    ctx: IRequestContext,
    id: string,
    data: Partial<UpdateTenantDto>,
  ): Promise<TenantDto> {
    return await this.tenantRepository.update(ctx, id, data);
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQueryDto,
  ): Promise<PageDto<TenantDto>> {
    return await this.tenantRepository.paginate(ctx, query);
  }
}
