import { Module, Global } from '@nestjs/common';
import { KeyService } from './key/key.service';
import { ClientService } from './client/client.service';
import { ConnectionService } from './connection/connection.service';
import { DeviceService } from './device/device.service';
import { ResourceServerService } from './resource-server/resource-server.service';
import { OrganizationService } from './organization/organization.service';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { SecretQuestionService } from './secret-question/secret-question.service';
import { Mailer } from './mailer/mailer';
import { EmailTemplateService } from './email-template/email-template.service';
import { PasswordResetService } from './password-reset/password-reset.service';
import { PermissionService } from './permission/permission.service';
import { ClientGrantService } from './client-grant/client-grant.service';
import { SigningKeyGenerator } from 'libs/shared/src/key-generator/key.generator';
import { IdentityService } from './identity/identity.service';
import { UserEventHandler } from './user/user.event.handler';
import { GroupService } from './group/group.service';
import { InvitationService } from './invitation/invitation.service';
import { OrganizationMemberService } from './organization/organization-member.service';
import { OrganizationMemberRoleService } from './organization/organization-member-role.service';
import { ConfigService } from './config/config.service';
import { EnrollmentService } from './guardian/enrollment/enrollment.service';
import { FactorService } from './guardian/factor/factor.service';
import { TriggerService } from './action/trigger/trigger.service';
import { ActionService } from './action/action/action.serivce';
import { TriggerBindingService } from './action/trigger-binding/trigger-binding.service';
import { GrantService } from './grant/grant.service';
import { EmailProviderService } from './email-provider/email-provider.service';
import { ResourceServerEventHandler } from './resource-server/resource-server.event.handler';
import { BcryptPasswordCryptor } from './user/password-cryptor/bcrypt.password-cryptor';
import { CustomDomainService } from './custom-domain/custom-domain.service';
import { MetricService } from './metric/metric.service';
import { TenantManager } from './tenant/tenant.manager';

@Global()
@Module({
  providers: [
    {
      provide: 'IKeyService',
      useClass: KeyService,
    },
    {
      provide: 'IClientService',
      useClass: ClientService,
    },
    {
      provide: 'IResourceServerService',
      useClass: ResourceServerService,
    },
    {
      provide: 'IConnectionService',
      useClass: ConnectionService,
    },
    {
      provide: 'IDeviceService',
      useClass: DeviceService,
    },
    {
      provide: 'IOrganizationService',
      useClass: OrganizationService,
    },
    {
      provide: 'IOrganizationMemberService',
      useClass: OrganizationMemberService,
    },
    {
      provide: 'IOrganizationMemberRoleService',
      useClass: OrganizationMemberRoleService,
    },
    {
      provide: 'IPasswordCryptor',
      useClass: BcryptPasswordCryptor,
    },
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    {
      provide: 'IIdentityService',
      useClass: IdentityService,
    },
    {
      provide: 'IRoleService',
      useClass: RoleService,
    },
    {
      provide: 'IPermissionService',
      useClass: PermissionService,
    },
    {
      provide: 'ISecretQuestionService',
      useClass: SecretQuestionService,
    },
    {
      provide: 'IMailer',
      useClass: Mailer,
    },
    {
      provide: 'IEmailTemplateService',
      useClass: EmailTemplateService,
    },
    {
      provide: 'IPasswordResetService',
      useClass: PasswordResetService,
    },
    {
      provide: 'IClientGrantService',
      useClass: ClientGrantService,
    },
    {
      provide: 'IGroupService',
      useClass: GroupService,
    },
    {
      provide: 'IInvitationService',
      useClass: InvitationService,
    },
    {
      provide: 'IConfigService',
      useClass: ConfigService,
    },
    {
      provide: 'IFactorService',
      useClass: FactorService,
    },
    {
      provide: 'IEnrollmentService',
      useClass: EnrollmentService,
    },
    {
      provide: 'ITriggerService',
      useClass: TriggerService,
    },
    {
      provide: 'IActionService',
      useClass: ActionService,
    },
    {
      provide: 'ITriggerBindingService',
      useClass: TriggerBindingService,
    },
    {
      provide: 'IGrantService',
      useClass: GrantService,
    },
    {
      provide: 'ICustomDomainService',
      useClass: CustomDomainService,
    },
    {
      provide: 'IEmailProviderService',
      useClass: EmailProviderService,
    },
    {
      provide: 'IMetricService',
      useClass: MetricService,
    },
    {
      provide: 'ITenantManager',
      useClass: TenantManager,
    },
    ResourceServerEventHandler,
    SigningKeyGenerator,
    UserEventHandler,
  ],
  exports: [
    'IKeyService',
    'IClientService',
    'IResourceServerService',
    'IConnectionService',
    'IDeviceService',
    'IOrganizationService',
    'IOrganizationMemberService',
    'IOrganizationMemberRoleService',
    'IUserService',
    'IIdentityService',
    'IRoleService',
    'IPermissionService',
    'ISecretQuestionService',
    'IMailer',
    'IEmailTemplateService',
    'IPasswordResetService',
    'IClientGrantService',
    'IGroupService',
    'IInvitationService',
    'IConfigService',
    'IFactorService',
    'IEnrollmentService',
    'ITriggerService',
    'IActionService',
    'ITriggerBindingService',
    'IGrantService',
    'ICustomDomainService',
    'IMetricService',
    'ITenantManager',
  ],
})
export class InfraCoreModule {}
