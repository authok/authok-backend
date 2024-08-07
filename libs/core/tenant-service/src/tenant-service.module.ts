import { Module, Global } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { DBConnectionService } from './db-connection.service';

@Global()
@Module({
  providers: [
    {
      provide: 'ITenantService',
      useClass: TenantService,
    },
    {
      provide: 'IDBConnectionService',
      useClass: DBConnectionService,
    },
    // TenantEventHandler, // TODO 事件监听要改成 
  ],
  exports: [
    'ITenantService',
    'IDBConnectionService',
  ],
})
export class TenantServiceModule {}
