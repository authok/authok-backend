import { Test, TestingModule } from '@nestjs/testing';
import { InfraSupportTypeOrmModule } from '../../infra.support.typeorm.module';
import { InfraCoreModule } from 'libs/core/infra-core/src/infra.core.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { IPModule } from 'libs/support/ipservice-support/src/ip.module';
import { NodeMailerMailModule } from 'libs/support/mail-nodemailer/src/mail.module';
import { TriggerModule } from 'libs/support/trigger-client/src/trigger.module';
import { LoggingTypeOrmModule } from 'libs/support/logstream-typeorm/src/logging.module';
import { SharedModule } from 'libs/shared/src/shared.module';
import { TenantConnectionManager } from 'libs/tenant-connection-manager/src/tenant.connection.manager';
import { OrganizationMemberEntity, OrganizationEntity, OrganizationMemberRoleEntity } from './organization.entity';
import { RoleEntity, UserRoleEntity } from '../role/role.entity';
import { PermissionEntity } from '../permission/permission.entity';
import { UserEntity } from '../user/user.entity';
import { IdentityEntity } from '../identity/identity.entity';
import { UserGroupEntity } from '../group/user-group.entity';
import { GroupEntity } from '../group/group.entity';
import { KeyEntity } from '../key/key.entity';
import { ClientEntity } from '../client/client.entity';
import { ResourceServerEntity } from '../resource-server/resource-server.entity';
import { ConnectionEntity } from '../connection/connection.entity';
import { DeviceEntity } from '../device/device.entity';
import { OrganizationEnabledConnectionEntity } from './enabled-connection.entity';
import { SecretQuestionEntity, SecretAnswerEntity } from '../secret-question/secret-question.entity';
import { BrandingEntity } from '../branding/branding.entity';
import { PasswordResetEntity } from '../password-reset/password-reset.entity';
import { PasswordHistoryEntity } from '../password-history/password-history.entity';
import { EmailTemplateEntity } from '../email-template/email-template.entity';
import { ClientGrantEntity } from '../client-grant/client-grant.entity';
import { InvitationEntity } from '../invitation/invitation.entity';
import { ConfigEntity } from '../config/config.entity';
import { ActionEntity } from '../action/action/action.entity';
import { TriggerEntity } from '../action/trigger/trigger.entity';
import { TriggerBindingEntity } from '../action/trigger-binding/trigger-binding.entity';
import { GrantEntity } from '../grant/grant.entity';
import { MetricEntity } from '../metric/metric.entity';
import { nanoid } from 'nanoid';
import { 
  IUserRepository,
  IOrganizationMemberRepository,
  IdentityModel,
} from 'libs/api/infra-api/src';



describe('OrganizationMember', () => {
  let userRepo: IUserRepository;
  let organizationMemberRepo: IOrganizationMemberRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({
          })],
        }),
        SharedModule,
        IPModule,
        TriggerModule,
        LoggingTypeOrmModule,
        NodeMailerMailModule,
        EventEmitterModule.forRoot({
          global: true,
        }),
        InfraSupportTypeOrmModule,
        InfraCoreModule,
      ],
    }).compile();

    // 因为 OnModuleInit 钩子没有被调用
    const tenantConnectionManager = module.get<TenantConnectionManager>('IConnectionManager');
    tenantConnectionManager.addEntities(
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

    userRepo = module.get<IUserRepository>('IUserRepository');
    organizationMemberRepo = module.get<IOrganizationMemberRepository>('IOrganizationMemberRepository');
  });

  afterAll(() => {
  });

  it('需要被定义', () => {
    expect(organizationMemberRepo).toBeDefined();
  });

  it('创建member', async () => {
    const ctx = { tenant: 'org_1' };

    const user_id = nanoid(24);
    const user = await userRepo.create(ctx, {
      connection: 'database1',
      user_id: 'authok|' + user_id,
      identities: [
        {
          user_id,
          provider: 'authok',
          connection: 'database1',
        } as IdentityModel,
      ],
    });

    const orgMember = await organizationMemberRepo.createOne(ctx, {
      organization: {
        id: 'org_1',
      },
      user: {
        tenant: user.tenant,
        user_id: user.user_id,
      },
      tenant: 'org_1',
    });

    console.log('orgMember: ', orgMember);
  });
});
