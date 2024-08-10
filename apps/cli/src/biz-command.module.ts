import { Global, Module } from '@nestjs/common';
import { DBConnectionCommand } from './modules/db-connections/db-connection.command';
import { ConnectionCommand } from './modules/connection/connection.command';
import { TenantCommand } from './modules/tenant/tenant.command';
import { MarketplaceCommand } from './modules/marketplace/marketplace.command';
import { TriggerBindingCommand } from './modules/action/trigger-binding.command';
import { PasswordResetCommand } from './modules/password-reset/password-rest.command';
import { OrganizationCommand } from './modules/organization/organization.command';
import { FeatureCommand } from './modules/marketplace/feature.command';
import { ClientCommand } from './modules/client/client.command';

@Global()
@Module({
  providers: [
    DBConnectionCommand,
    ConnectionCommand,
    ClientCommand,
    TriggerBindingCommand,
    TenantCommand,
    MarketplaceCommand,
    FeatureCommand,
    PasswordResetCommand,
    OrganizationCommand,
  ],
})
export class BizCommandModule {}
