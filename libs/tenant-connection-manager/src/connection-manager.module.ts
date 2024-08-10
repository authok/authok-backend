import { Global, Module } from "@nestjs/common";
import { TenantConnectionManager } from "./tenant.connection.manager";

@Global()
@Module({
  providers: [
    {
      provide: 'IConnectionManager',
      useClass: TenantConnectionManager,
    },
  ],
  exports: [
    'IConnectionManager'
  ]
})
export class TenantConnectionManagerModule {}