import { Injectable, Inject } from '@nestjs/common';
import { IRequestContext } from '@libs/nest-core';
import {
  EntityTarget,
  Repository,
  EntityManager,
  getManager as _getManager,
  Connection,
} from 'typeorm';
import { TenantConnectionManager } from '../../../../../tenant-connection-manager/src/tenant.connection.manager';

@Injectable()
export class TenantAwareRepository {
  constructor(
    @Inject('IConnectionManager')
    protected readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  async repo<T>(
    ctx: IRequestContext,
    type: EntityTarget<T>,
  ): Promise<Repository<T>> {
    const connection = await this.tenantConnectionManager.get(ctx);
    return await connection.getRepository(type);
  }

  async connection<T>(ctx: IRequestContext): Promise<Connection> {
    return await this.tenantConnectionManager.get(ctx);
  }

  async getManager(ctx: IRequestContext): Promise<EntityManager> {
    const connection = await this.tenantConnectionManager.get(ctx);
    return _getManager(connection.name);
  }
}
