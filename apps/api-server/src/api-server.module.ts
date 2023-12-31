import { Module, MiddlewareConsumer, NestModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { RedisModule, RedisService } from '@authok/nestjs-redis';
import { ScheduleModule } from '@nestjs/schedule';

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { TicketModule } from 'libs/core/ticket-core/src/ticket.module';
import { SupportModule } from './support.module';
import { NotificationModule } from 'libs/core/notifications-core/src/notification.module';
import { AuthenticationOpenApiModule } from 'libs/openapi/authentication-openapi/src/authentication.openapi.module';
import { ManagementOpenApiModule } from 'libs/openapi/management-openapi/src/management.openapi.module';
import { SharedModule } from 'libs/shared/src/shared.module';
import { APIExceptionFilter } from 'libs/common/src/filters/api-exception.filter';
import { InfraSupportTypeOrmModule } from 'libs/support/infra-support-typeorm/src/infra.support.typeorm.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InfraCoreModule } from 'libs/core/infra-core/src/infra.core.module';
import { OIDCProviderModule } from 'libs/oidc/provider/src/lib/oidc-provider.module';
import { AuthorizationModule } from 'libs/core/authorization-core/src/authorization.module';
import { AuthenticationModule } from 'libs/core/authentication-core/src/authentication.module';
import { TenantModule } from 'libs/support/tenant-support-typeorm/src/tenant.module';
import { RequestContextInterceptor } from 'libs/core/infra-core/src/request-context/request-context.interceptor';
import { HttpExceptionFilter } from 'libs/common/src/filters/http-exception.filter';
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import * as session from 'express-session';
import * as ConnectRedis from 'connect-redis';
import { TriggerModule } from 'libs/support/trigger-client/src/trigger.module';
import { SAMLPModule } from 'libs/samlp/src/samlp.module';
const RedisStore = ConnectRedis(session);

@Global()
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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: 60,
        limit: 5,
        storage: new ThrottlerStorageRedisService(configService.get('redis')),
      }),
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    ScheduleModule.forRoot(),
    SessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, RedisService],
      useFactory: async (
        config: ConfigService,
        redis: RedisService,
      ): Promise<NestSessionOptions> => {
        const redisClient = redis.getClient();
        const store = new RedisStore({ client: redisClient });
        return {
          session: {
            resave: false,
            saveUninitialized: false,
            secret: config.get('SECRET') || 'okhtua',
            store,
          },
        };
      },
    }),
    TriggerModule,
    SharedModule,
    NotificationModule,
    TicketModule,
    SupportModule,
    OIDCProviderModule,
    SAMLPModule,
    AuthorizationModule,
    AuthenticationModule,
    AuthenticationOpenApiModule,
    ManagementOpenApiModule,
    TenantModule,
    InfraCoreModule,
    InfraSupportTypeOrmModule,
  ],
  providers: [
    /*{
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    */
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: APIExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
  ],
})
export class ApiServerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
