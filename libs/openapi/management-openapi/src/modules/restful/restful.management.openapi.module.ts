import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TenantController } from './tenant/tenant.controller';
import { MappingsController } from './mappings/mappings.controller';
import { DeviceController } from './device/device.controller';
import { ConnectionController } from './connection/connection.controller';
import { ClientController } from './client/client.controller';
import { OrganizationController } from './organization/organization.controller';
import { OrganizationInvitationController } from './organization/organization-invitation.controller';
import { UserController } from './user/user.controller';
import { ResourceServerController } from './resource-server/resource-server.controller';
import { JoiPipeModule } from 'nestjs-joi';
import { EmailTemplateController } from './email-template/email-tempalte.controller';
import { RoleController } from './role/role.controller';
import { LogController } from './log/log.controller';
import { RedisService } from '@authok/nestjs-redis';
import { redisInsStore } from 'cache-manager-ioredis-yet';
import { ClientGrantController } from './client-grant/client-grant.controller';
import { PassportModule } from 'libs/passport/src/passport.module';
import { GrantController } from './grant/grant.controller';
import { TriggerController } from './action/trigger.controller';
import { TriggerBindingController } from './action/trigger-binding.controller';
import { ActionController } from './action/action.controller';
import { KeyController } from './key/key.controller';
import { CustomDomainController } from './custom-domain/custom-domain.controller';
import { OrganizationMemberController } from './organization/organization-member.controller';
import { UserFilterController } from './user/user-filter.controller';
import { OrganizationMemberRoleController } from './organization/organization-member-role.controller';

@Module({
  controllers: [
    UserController,
    UserFilterController,
    TenantController,
    MappingsController,
    DeviceController,
    ConnectionController,
    ClientController,
    ResourceServerController,
    OrganizationMemberController,
    OrganizationMemberRoleController,
    OrganizationInvitationController,
    OrganizationController,
    EmailTemplateController,
    RoleController,
    LogController,
    ClientGrantController,
    GrantController,
    TriggerController,
    TriggerBindingController,
    ActionController,
    KeyController,
    CustomDomainController,
  ],
  imports: [
    PassportModule,
    JoiPipeModule.forRoot({
      pipeOpts: {
        defaultValidationOptions: {
          allowUnknown: false,
        }
      }
    }),
    CacheModule.registerAsync({
      useFactory: async (redisService: RedisService) => {
        return {
          ttl: 30, // seconds
          max: 10000, // maximum number of items in cache
          store: () => redisInsStore(redisService.getClient()),
        };
      },
      inject: [RedisService],
    }),
  ],
})
export class RestfulManagementOpenApiModule {}
