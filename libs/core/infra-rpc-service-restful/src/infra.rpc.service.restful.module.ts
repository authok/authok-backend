import { Module } from '@nestjs/common';
import { TenantController } from './modules/tenant/tenant.controller';
import { KeyController } from './modules/key/key.controller';
import { ConnectionController } from './modules/connection/connection.controller';
import { ClientController } from './modules/client/client.controller';
import { ResourceServerController } from './modules/resource-server/resource-server.controller';
import { OrganizationController } from './modules/organization/organization.controller';

@Module({
  controllers: [
    TenantController,
    KeyController,
    ClientController,
    ResourceServerController,
    ConnectionController,
    OrganizationController,
  ],
})
export class InfraRpcServiceRestfulModule {}
