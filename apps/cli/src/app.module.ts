import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import configuration from 'apps/mgmt-api-server/src/config/configuration';
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
import { TypeOrmLogModule } from 'libs/support/logstream-typeorm/src/log.module';
import { NodeMailerMailModule } from 'libs/support/mail-nodemailer/src/mail.module';
import { PasswordlessSupportModule } from 'libs/support/passwordless/src/passwordless.module';
import { VM2SandboxModule } from 'libs/support/sandbox-vm2/src/vm2.sandbox.module';
import { CloudNativeSmsModule } from 'libs/support/sms-cloudnative/src/sms.module';
import { TenantModule } from 'libs/support/tenant-support-typeorm/src/tenant.module';
import { RedisTicketModule } from 'libs/support/ticket-redis/src/redis-ticket.module';
import { CommandModule } from 'nestjs-command';
import { RedisModule } from '@authok/nestjs-redis';
import { BizCommandModule } from './biz-command.module';
import { TriggerModule } from 'libs/support/trigger-client/src/trigger.module';
import { MarketplaceTypeOrmModule } from 'libs/support/marketplace-typeorm/src/marketplace.typeorm.module';
import { MarketplaceCoreModule } from 'libs/core/marketplace-core/src/marketplace.core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    TypeOrmLogModule,
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
    TenantModule,
    InfraCoreModule,
    InfraSupportTypeOrmModule,
    CommandModule,
    BizCommandModule,
    TriggerModule,
    MarketplaceCoreModule,
    MarketplaceTypeOrmModule,
  ],
})
export class AppModule {}
