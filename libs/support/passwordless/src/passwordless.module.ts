import { Global, Module, Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PasswordlessToken } from './passwordless-token.entity';
import { RedisPasswordlessTokenRepository } from './redis-passwordless-token.repository';
import { TenantConnectionManager } from 'libs/tenant-connection-manager/src/tenant.connection.manager';

@Injectable()
class ModuleInitializer implements OnModuleInit {
  constructor(
    @Inject('IConnectionManager')
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  onModuleInit() {
    this.tenantConnectionManager.addEntities(PasswordlessToken);
  }
}

@Global()
@Module({
  providers: [
    ModuleInitializer,
    {
      provide: 'IPasswordlessTokenRepository',
      useClass: RedisPasswordlessTokenRepository, // TypeOrmPasswordlessTokenRepository,
    },
  ],
  exports: ['IPasswordlessTokenRepository'],
})
export class PasswordlessSupportModule {}
