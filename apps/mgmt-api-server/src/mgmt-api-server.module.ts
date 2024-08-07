import { Module, Global } from '@nestjs/common';
import { SharedModule } from 'libs/shared/src/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@authok/nestjs-redis';
import configuration from './config/configuration';
import { InfraCoreModule } from 'libs/core/infra-core/src/infra.core.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { InfraSupportTypeOrmModule } from 'libs/support/infra-support-typeorm/src/infra.support.typeorm.module';
import { NotificationModule } from 'libs/core/notifications-core/src/notification.module';
import { CloudNativeSmsModule } from 'libs/support/sms-cloudnative/src/sms.module';
import { NodeMailerMailModule } from 'libs/support/mail-nodemailer/src/mail.module';
import { IPModule } from 'libs/support/ipservice-support/src/ip.module';
import { VM2SandboxModule } from 'libs/support/sandbox-vm2/src/vm2.sandbox.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JoiPipeModule } from 'nestjs-joi';
import { MarketplaceTypeOrmModule } from 'libs/support/marketplace-typeorm/src/marketplace.typeorm.module';
import { MarketplaceCoreModule } from 'libs/core/marketplace-core/src/marketplace.core.module';
import { APIExceptionFilter } from 'libs/common/src/filters/api-exception.filter';
import { HttpExceptionFilter } from 'libs/common/src/filters/http-exception.filter';
import { LoggingTypeOrmModule } from 'libs/support/logstream-typeorm/src/logging.module';

import { TenantController } from './modules/tenant/tenant.controller';
import { TenantInvitationController } from './modules/tenant/tenant-invitation.controller';
import { ApplicationController } from './modules/application/application.controller';
import { UserController } from './modules/user/user.controller';
import { ConnectionController } from './controllers/connection.controller';
import { ResourceServerController } from './modules/resource-server/resource-server.controller';
import { RoleController } from './controllers/role.controller';
import { ElasticSearchModule } from 'libs/support/search-es/src/search.module';
import { GroupController } from './controllers/group.controller';
import { ClientGrantController } from './controllers/client-grant.controller';
import { OrganizationController } from './modules/organization/organization.controller';
import { OrganizationInvitationController } from './modules/organization/organization-invitation.controller';
import { OrganizationMemberController } from './modules/organization/organization-member.controller';
import { OrganizationMemberRoleController } from './modules/organization/organization-member-role.controller';
import { EmailTemplateController } from './modules/email-template/email-template.controller';
import { ConfigController } from './modules/config/config.controller';
import { EnrollmentController } from './modules/guardian/enrollment.controller';
import { FactorController } from './modules/guardian/factor.controller';
import { TriggerBindingController } from './modules/action/trigger/trigger-binding.controller';
import { ActionController } from './modules/action/action/action.controller';
import { TriggerController } from './modules/action/trigger/trigger.controller';
import { FormSchemaController } from './controllers/form-schema.controller';
import { ExpressJwtRequestContextInterceptor } from 'libs/shared/src/request-context/express-jwt/request-context.interceptor';
import { LogController } from './controllers/log.controller';
import { KeyController } from './controllers/key.controller';
import { TriggerModule } from 'libs/support/trigger-client/src/trigger.module';
import { ProfileController } from './controllers/profile.controller';
import { LoginController } from './controllers/login.controller';
import { StatsController } from './modules/stats/stats.controller';
import { FeatureController } from './modules/marketplace/feature.controller';
import { CategoryController } from './modules/marketplace/category.controller';
import { CatalogController } from './modules/marketplace/catalog.controller';
import { HttpModule } from '@nestjs/axios';
import { TenantGrpcClientModule } from 'libs/client/tenant/src/tenant-grpc-client.module';

@Global()
@Module({
  imports: [
    HttpModule,
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
    JoiPipeModule.forRoot({
      pipeOpts: {
        defaultValidationOptions: {
          allowUnknown: false,
        }
      }
    }),
    SharedModule,
    CloudNativeSmsModule,
    NodeMailerMailModule,
    VM2SandboxModule,
    IPModule,
    NotificationModule,
    TenantGrpcClientModule,
    InfraCoreModule,
    InfraSupportTypeOrmModule,
    LoggingTypeOrmModule,
    MarketplaceCoreModule,
    MarketplaceTypeOrmModule,
    ElasticSearchModule,
    TriggerModule,
  ],
  providers: [
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
      useClass: ExpressJwtRequestContextInterceptor,
    },
  ],
  controllers: [
    TenantController,
    TenantInvitationController,
    ApplicationController,
    ConnectionController,

    CatalogController,
    FeatureController,
    CategoryController,

    UserController,
    ResourceServerController,
    RoleController,
    GroupController,
    ClientGrantController,
    OrganizationMemberRoleController,
    OrganizationMemberController,
    OrganizationInvitationController,
    OrganizationController,
    EmailTemplateController,
    ConfigController,
    // mfa
    FactorController,
    EnrollmentController,
    TriggerBindingController,
    TriggerController,
    ActionController,
    FormSchemaController,
    LogController,
    KeyController,
    ProfileController,
    LoginController,
    StatsController,
  ],
})
export class MgmtApiServerModule {}
