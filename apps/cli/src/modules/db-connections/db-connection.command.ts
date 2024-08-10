import { Inject, Injectable } from '@nestjs/common';
import { IDBConnectionService } from 'libs/api/infra-api/src';
import { TenantConnectionManager } from 'libs/tenant-connection-manager/src/tenant.connection.manager';
import { Command } from 'nestjs-command';

@Injectable()
export class DBConnectionCommand {
  constructor(
    @Inject('IDBConnectionService')
    private readonly dbConnectionService: IDBConnectionService,
    @Inject('IConnectionManager')
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  @Command({
    command: 'list:all',
    describe: '列出所有连接',
  })
  async list() {
    const connections = this.tenantConnectionManager.getAll();
    return connections.map((it) => ({
      name: it.options.name,
      type: it.options.type,
      database: it.options.database,
    }));
  }
}
