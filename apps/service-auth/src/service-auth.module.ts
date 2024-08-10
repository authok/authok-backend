import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { InfraRpcServiceRestfulModule } from 'libs/core/infra-rpc-service-restful/src/infra.rpc.service.restful.module';
import { InfraCoreModule } from 'libs/core/infra-core/src/infra.core.module';
import { InfraSupportTypeOrmModule } from 'libs/support/infra-support-typeorm/src/infra.support.typeorm.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from 'libs/core/notifications-core/src/notification.module';
import { RedisTicketModule } from 'libs/support/ticket-redis/src/redis-ticket.module';
import { PasswordlessSupportModule } from 'libs/support/passwordless/src/passwordless.module';
import { CloudNativeSmsModule } from 'libs/support/sms-cloudnative/src/sms.module';
import { CloudNativeMailModule } from 'libs/support/mail-cloudnative/src/mail.module';
import { VM2SandboxModule } from 'libs/support/sandbox-vm2/src/vm2.sandbox.module';
import { IPModule } from 'libs/support/ipservice-support/src/ip.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    NotificationModule,
    InfraRpcServiceRestfulModule,
    InfraCoreModule,
    InfraSupportTypeOrmModule,
    PasswordlessSupportModule,
    CloudNativeSmsModule,
    CloudNativeMailModule,
    VM2SandboxModule,
    IPModule,
  ],
})
export class ServiceAuthModule {}
