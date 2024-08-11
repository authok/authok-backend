import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthenticationModule } from 'libs/core/authentication-core/src/authentication.module';
import { AuthorizationModule } from 'libs/core/authorization-core/src/authorization.module';
import { InfraCoreModule } from 'libs/core/infra-core/src/infra.core.module';
import { NotificationModule } from 'libs/core/notifications-core/src/notification.module';
import { TicketModule } from 'libs/core/ticket-core/src/ticket.module';
import { OIDCProviderModule } from 'libs/oidc/provider/src/lib/oidc-provider.module';
import { PassportModule } from 'libs/passport/src/passport.module';
import { SharedModule } from 'libs/shared/src/shared.module';
import { InfraSupportTypeOrmModule } from 'libs/support/infra-support-typeorm/src/infra.support.typeorm.module';
import { IPModule } from 'libs/support/ipservice-support/src/ip.module';
import { NodeMailerMailModule } from 'libs/support/mail-nodemailer/src/mail.module';
import { PasswordlessSupportModule } from 'libs/support/passwordless/src/passwordless.module';
import { VM2SandboxModule } from 'libs/support/sandbox-vm2/src/vm2.sandbox.module';
import { CloudNativeSmsModule } from 'libs/support/sms-cloudnative/src/sms.module';
import { RedisTicketModule } from 'libs/support/ticket-redis/src/redis-ticket.module';
import { CommandModule } from 'nestjs-command';
import { RedisModule } from '@authok/nestjs-redis';

import { BizCommandModule } from './biz-command.module';
import { TriggerModule } from 'libs/support/trigger-client/src/trigger.module';
import { MarketplaceTypeOrmModule } from 'libs/support/marketplace-typeorm/src/marketplace.typeorm.module';
import { MarketplaceCoreModule } from 'libs/core/marketplace-core/src/marketplace.core.module';
import { TenantGrpcClientModule } from 'libs/client/tenant/src/tenant-grpc-client.module';
import { TenantConnectionManagerModule } from 'libs/tenant-connection-manager/src/connection-manager.module';
import { LoggingGrpcClientModule } from 'libs/client/logging/src/logging-grpc-client.module';
import { LoggingTypeOrmModule } from 'libs/support/logstream-typeorm/src/logging.module';
import { MarketplaceGrpcClientModule } from 'libs/client/marketplace/src/marketplace-grpc-client.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      load: [configuration],
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    SharedModule,
    NotificationModule,
    TicketModule,
    RedisTicketModule,
    PasswordlessSupportModule,
    CloudNativeSmsModule,
    // CloudNativeMailModule,
    NodeMailerMailModule,
    VM2SandboxModule,
    IPModule,
    PassportModule,
    OIDCProviderModule,
    AuthorizationModule,
    AuthenticationModule,
    InfraCoreModule,
    InfraSupportTypeOrmModule,
    CommandModule,
    BizCommandModule,
    TriggerModule,
    TenantConnectionManagerModule,
    TenantGrpcClientModule,
    ...(process.env.LOGGING_SERVICE_MICROSERVICE_DISABLED ? [MarketplaceTypeOrmModule, MarketplaceCoreModule] : [MarketplaceGrpcClientModule]),
    ...(process.env.LOGGING_SERVICE_MICROSERVICE_DISABLED ? [LoggingTypeOrmModule] : [LoggingGrpcClientModule]),
  ],
})
export class AppModule {}
