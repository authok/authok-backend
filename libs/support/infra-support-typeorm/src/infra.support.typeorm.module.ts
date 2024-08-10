import {
  Module,
  Global,
  OnModuleInit,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import { ResourceServerEntity } from './modules/resource-server/resource-server.entity';
import { KeyEntity } from './modules/key/key.entity';
import { ClientEntity } from './modules/client/client.entity';
import { TypeOrmClientRepository } from './modules/client/typeorm.client.repository';
import { TypeOrmKeyRepository } from './modules/key/typeorm.key.repository';
import { ConnectionEntity } from './modules/connection/connection.entity';
import { TypeOrmConnectionRepository } from './modules/connection/typeorm.connection.repository';
import { TypeOrmResourceServerRepository } from './modules/resource-server/typeorm.resource-server.repository';
import { TypeOrmDeviceRepository } from './modules/device/typeorm.device.repository';
import { DeviceEntity } from './modules/device/device.entity';
import { TypeOrmOrganizationRepository } from './modules/organization/typeorm.organization.repository';
import {
  OrganizationEntity,
  OrganizationMemberEntity,
  OrganizationMemberRoleEntity,
} from './modules/organization/organization.entity';
import { BrandingEntity } from './modules/branding/branding.entity';
import { UserEntity } from './modules/user/user.entity';
import { RoleEntity, UserRoleEntity } from './modules/role/role.entity';
import { IdentityEntity } from './modules/identity/identity.entity';
import { TypeOrmUserRepository } from './modules/user/typeorm.user.repository';
import { TypeOrmRoleRepository } from './modules/role/typeorm.role.repository';
import {
  SecretAnswerEntity,
  SecretQuestionEntity,
} from './modules/secret-question/secret-question.entity';
import { TypeOrmIdentityRepository } from './modules/identity/typeorm.identity.repository';
import { TypeOrmUserRoleRepository } from './modules/role/typeorm.user-role.repository';
import { TypeOrmSecretQuestionRepository } from './modules/secret-question/typeorm.secret-question.repository';
import { TypeOrmSecretAnswerRepository } from './modules/secret-question/typeorm.secret-answer.repository';
import { PasswordHistoryEntity } from './modules/password-history/password-history.entity';
import { TypeOrmPasswordHistoryRepository } from './modules/password-history/typeorm.password-history.repository';
import { PasswordResetEntity } from './modules/password-reset/password-reset.entity';
import { TypeOrmPasswordResetRepository } from './modules/password-reset/typeorm.password-reset.repository';
import { EmailTemplateEntity } from './modules/email-template/email-template.entity';
import { TypeOrmEmailTemplateRepository } from './modules/email-template/typeorm.email-template.repository';
import { PermissionEntity } from './modules/permission/permission.entity';
import { TypeOrmPermissionRepository } from './modules/permission/typeorm.permission.repository';
import { ClientGrantEntity } from './modules/client-grant/client-grant.entity';
import { TypeOrmClientGrantRepository } from './modules/client-grant/typeorm.client-grant.repository';
import { TenantConnectionManager } from 'libs/tenant-connection-manager/src/tenant.connection.manager';
import { TypeOrmGroupRepository } from './modules/group/typeorm.group.repository';
import { GroupEntity } from './modules/group/group.entity';
import { UserGroupEntity } from './modules/group/user-group.entity';
import { ResourceServerMapper } from './modules/resource-server/resource-server.mapper';
import { GroupMapper } from './modules/group/group.mapper';
import { UserMapper } from './modules/user/user.mapper';
import { ClientGrantMapper } from './modules/client-grant/client-grant.mapper';
import { ConnectionMapper } from './modules/connection/connection.mapper';
import { InvitationMapper } from './modules/invitation/invitation.mapper';
import { TypeOrmInvitationRepository } from './modules/invitation/typeorm.invitation.repository';
import { InvitationEntity } from './modules/invitation/invitation.entity';
import { OrganizationMapper } from './modules/organization/organization.mapper';
import { OrganizationMemberMapper } from './modules/organization/organization-member.mapper';
import { TypeOrmOrganizationMemberRepository } from './modules/organization/typeorm.organization-member.repository';
import { OrganizationMemberRoleMapper } from './modules/organization/organization-member-role.mapper';
import { TypeOrmOrganizationMemberRoleRepository } from './modules/organization/organization-member-role.repository';
import { ConfigEntity } from './modules/config/config.entity';
import { TypeOrmConfigRepository } from './modules/config/typeorm.config.repository';
import { TriggerMapper } from './modules/action/trigger/trigger.mapper';
import { ActionMapper } from './modules/action/action/action.mapper';
import { TypeOrmTriggerRepository } from './modules/action/trigger/typeorm.trigger.repository';
import { ActionEntity } from './modules/action/action/action.entity';
import { TriggerBindingEntity } from './modules/action/trigger-binding/trigger-binding.entity';
import { TriggerEntity } from './modules/action/trigger/trigger.entity';
import { TypeOrmActionRepository } from './modules/action/action/typeorm.action.repository';
import { TypeOrmTriggerBindingRepository } from './modules/action/trigger-binding/typeorm.trigger-binding.repository';
import { TypeOrmGrantRepository } from './modules/grant/typeorm.grant.repository';
import { GrantMapper } from './modules/grant/grant.mapper';
import { GrantEntity } from './modules/grant/grant.entity';
import { SigningKeyGenerator } from 'libs/shared/src/key-generator/key.generator';
import { NestCoreModule } from '@libs/nest-core';
import { PasswordResetMapper } from './modules/password-reset/password-rest.mapper';
import { NestCoreMultiTenancyTypeOrmModule } from '@libs/nest-core-typeorm';
import { CustomDomainEntity } from './modules/custom-domain/custom-domain.entity';
import { CustomDomainMapper } from './modules/custom-domain/custom-domain.mapper';
import { OrganizationEnabledConnectionEntity } from './modules/organization/enabled-connection.entity';
import { OrganizationEnabledConnectionMapper } from './modules/organization/organization-enabled-connection.mapper';
import { MetricMapper } from './modules/metric/metric.mapper';
import { MetricEntity } from './modules/metric/metric.entity';
import { ClientMapper } from './modules/client/client.mapper';

@Injectable()
class ModuleInitializer implements OnModuleInit {
  constructor(
    @Inject('IConnectionManager')
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  onModuleInit() {
    Logger.debug(`InfraSupportTypeOrmModule.onModuleInit`);
    this.tenantConnectionManager.addEntities(
      KeyEntity,
      ClientEntity,
      ResourceServerEntity,
      ConnectionEntity,
      DeviceEntity,
      OrganizationEntity,
      OrganizationMemberEntity,
      OrganizationMemberRoleEntity,
      OrganizationEnabledConnectionEntity,
      BrandingEntity,
      UserEntity,
      PermissionEntity,
      RoleEntity,
      UserRoleEntity,
      SecretQuestionEntity,
      SecretAnswerEntity,
      PasswordResetEntity,
      PasswordHistoryEntity,
      IdentityEntity,
      EmailTemplateEntity,
      ClientGrantEntity,
      GroupEntity,
      UserGroupEntity,
      InvitationEntity,
      ConfigEntity,

      // action
      ActionEntity,
      TriggerEntity,
      TriggerBindingEntity,

      GrantEntity,
      MetricEntity,
    );
  }
}

@Global()
@Module({
  imports: [
    NestCoreModule.forFeature({
      global: true,
      imports: [
        NestCoreMultiTenancyTypeOrmModule.forFeature(
          [
            PasswordResetEntity,
            InvitationEntity,
            CustomDomainEntity,
            OrganizationEnabledConnectionEntity,
            OrganizationEntity,
            OrganizationMemberEntity,
            OrganizationMemberRoleEntity,
            MetricEntity,
          ],
          'IConnectionManager',
        ),
      ],
      mappers: [
        PasswordResetMapper,
        InvitationMapper,
        CustomDomainMapper,
        OrganizationMapper,
        OrganizationMemberMapper,
        OrganizationEnabledConnectionMapper,
        MetricMapper,
      ],
    }),
  ],
  providers: [
    SigningKeyGenerator,
    {
      provide: 'IKeyRepository',
      useClass: TypeOrmKeyRepository,
    },
    {
      provide: 'IClientRepository',
      useClass: TypeOrmClientRepository,
    },
    {
      provide: 'IResourceServerRepository',
      useClass: TypeOrmResourceServerRepository,
    },
    {
      provide: 'IConnectionRepository',
      useClass: TypeOrmConnectionRepository,
    },
    {
      provide: 'IDeviceRepository',
      useClass: TypeOrmDeviceRepository,
    },
    {
      provide: 'IOrganizationRepository',
      useClass: TypeOrmOrganizationRepository,
    },
    {
      provide: 'IOrganizationMemberRepository',
      useClass: TypeOrmOrganizationMemberRepository,
    },
    {
      provide: 'IOrganizationMemberRoleRepository',
      useClass: TypeOrmOrganizationMemberRoleRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'IIdentityRepository',
      useClass: TypeOrmIdentityRepository,
    },
    {
      provide: 'IRoleRepository',
      useClass: TypeOrmRoleRepository,
    },
    {
      provide: 'IPermissionRepository',
      useClass: TypeOrmPermissionRepository,
    },
    {
      provide: 'IUserRoleRepository',
      useClass: TypeOrmUserRoleRepository,
    },
    {
      provide: 'ISecretQuestionRepository',
      useClass: TypeOrmSecretQuestionRepository,
    },
    {
      provide: 'ISecretAnswerRepository',
      useClass: TypeOrmSecretAnswerRepository,
    },
    {
      provide: 'IPasswordHistoryRepository',
      useClass: TypeOrmPasswordHistoryRepository,
    },
    {
      provide: 'IPasswordResetRepository',
      useClass: TypeOrmPasswordResetRepository,
    },
    {
      provide: 'ISecretQuestionRepository',
      useClass: TypeOrmSecretQuestionRepository,
    },
    {
      provide: 'IEmailTemplateRepository',
      useClass: TypeOrmEmailTemplateRepository,
    },
    {
      provide: 'IClientGrantRepository',
      useClass: TypeOrmClientGrantRepository,
    },
    {
      provide: 'IGroupRepository',
      useClass: TypeOrmGroupRepository,
    },
    {
      provide: 'IInvitationRepository',
      useClass: TypeOrmInvitationRepository,
    },
    {
      provide: 'IConfigRepository',
      useClass: TypeOrmConfigRepository,
    },
    {
      provide: 'ITriggerRepository',
      useClass: TypeOrmTriggerRepository,
    },
    {
      provide: 'IActionRepository',
      useClass: TypeOrmActionRepository,
    },
    {
      provide: 'ITriggerBindingRepository',
      useClass: TypeOrmTriggerBindingRepository,
    },
    {
      provide: 'IGrantRepository',
      useClass: TypeOrmGrantRepository,
    },
    // Data Mapper
    ResourceServerMapper,
    GroupMapper,
    ClientMapper,
    UserMapper,
    ClientGrantMapper,
    ConnectionMapper,
    OrganizationMemberRoleMapper,
    // action
    ActionMapper,
    TriggerMapper,
    GrantMapper,

    ModuleInitializer,
  ],
  exports: [
    'IConnectionRepository',
    'IResourceServerRepository',
    'IClientRepository',
    'IKeyRepository',
    'IDeviceRepository',
    'IOrganizationRepository',
    'IOrganizationMemberRepository',
    'IOrganizationMemberRoleRepository',
    'IUserRepository',
    'IIdentityRepository',
    'IRoleRepository',
    'IPermissionRepository',
    'IUserRoleRepository',
    'ISecretQuestionRepository',
    'ISecretAnswerRepository',
    'IPasswordHistoryRepository',
    'IPasswordResetRepository',
    'IEmailTemplateRepository',
    'IClientGrantRepository',
    'IGroupRepository',
    'IInvitationRepository',
    'IConfigRepository',
    'ITriggerRepository',
    'IActionRepository',
    'ITriggerBindingRepository',
    'IGrantRepository',
  ],
})
export class InfraSupportTypeOrmModule {}
