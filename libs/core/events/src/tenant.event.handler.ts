import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { 
  IResourceServerService,
  IKeyService,
  ITenantService,
  IConnectionService,
  IClientService,
  IClientGrantService,
  ITriggerService,
  TenantModel,
  CreateResourceServerModel,
  TenantCreatedEvent,
} from 'libs/api/infra-api/src';
import { SigningKeyGenerator } from 'libs/shared/src/key-generator/key.generator';
import { managementApiScopes } from '@libs/core/infra-core/resource-server/management.api.scopes';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TenantEventHandler {
  constructor(
    @Inject('ITenantService') private readonly tenantService: ITenantService,
    @Inject('IResourceServerService')
    private readonly resourceServerService: IResourceServerService,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IClientService') private readonly clientService: IClientService,
    @Inject('IClientGrantService')
    private readonly clientGrantService: IClientGrantService,
    @Inject('IKeyService') private readonly keyService: IKeyService,
    private readonly signingKeyGenerator: SigningKeyGenerator,
    @Inject('ITriggerService') private readonly triggerService: ITriggerService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent('tenant.created')
  async handleTenantCreatedEvent(event: TenantCreatedEvent) {
    try {
      console.log(event);
      console.log('tenant 创建成功');

      const tenant = await this.tenantService.retrieve({}, event.id);
      if (!tenant) {
        Logger.error('tenant not found');
        throw new NotFoundException('tenant not found');
      }

      await this.createSigningKeys(tenant);

      await this.createTriggers(tenant);

      await this.initTenant(tenant);
    } catch (e) {
      Logger.error(e);
      console.error(e);
    }
  }

  async createTriggers(tenant: TenantModel) {
    const triggers = [
      {
        id: 'post-login',
        display_name: '登录后',
        version: '1.0',
        runtimes: ['v14', 'v16'],
        default_runtime: 'v16',
        status: 'current',
      },
      {
        id: 'post-register',
        display_name: '注册后',
        version: '1.0',
        runtimes: ['v14', 'v16'],
        default_runtime: 'v16',
        status: 'current',
      },
    ];

    for (const trigger of triggers) {
      await this.triggerService.create({ tenant: tenant.id }, trigger);
    }
  }

  async initTenant(tenant: TenantModel) {
    const region = tenant.region || 'us';

    const domain = this.configService.get('domain', 'authok.io')

    const resourceServer = {
      name: 'Authok Management API',
      identifier: `https://${tenant.name}.${region}.${domain}/api/v2/`,
      is_system: true,
      allow_offline_access: true,
      skip_consent_for_verifiable_first_party_clients: false,
      token_lifetime: 86400,
      token_lifetime_for_web: 7200,
      scopes: managementApiScopes,
    } as CreateResourceServerModel;

    const createdResourceServer = await this.resourceServerService.create(
      { tenant: tenant.id },
      resourceServer,
    );
    Logger.log(
      `为租户: ${tenant.name} 创建了默认的API: ${createdResourceServer.id}, ${createdResourceServer.identifier}`,
    );

    Logger.debug('创建默认应用');
    const client = await this.clientService.create(
      { tenant: tenant.id },
      {
        name: '管理API测试用途',
        app_type: 'non_interactive',
        token_endpoint_auth_method: 'client_secret_post',
      },
    );

    console.log(
      'resourceServer.scopes: ',
      resourceServer.scopes.map((it) => it.value),
    );

    await this.clientGrantService.create(
      { tenant: tenant.id },
      {
        client_id: client.client_id,
        audience: resourceServer.identifier,
        scope: resourceServer.scopes.map((it) => it.value),
      },
    );

    this.createConnections(tenant);
  }

  async createConnections(tenant: TenantModel) {
    Logger.debug('创建默认身份源');

    await this.connectionService.create(
      { tenant: tenant.id },
      {
        name: 'sms',
        display_name: '短信',
        strategy: 'sms',
      },
    );

    await this.connectionService.create(
      { tenant: tenant.id },
      {
        name: 'email',
        display_name: '邮件',
        strategy: 'email',
      },
    );
  }

  async createSigningKeys(tenant: TenantModel) {
    const attrs = [
      { name: 'commonName', value: tenant.name },
      { name: 'countryName', value: 'zh' },
      { shortName: 'ST', value: tenant.name },
      { name: 'localityName', value: 'shenzhen' },
      { name: 'organizationName', value: tenant.name },
    ];

    const key1 = await this.signingKeyGenerator.generateSigningKey(
      'RS256',
      attrs,
    );

    const key2 = await this.signingKeyGenerator.generateSigningKey(
      'RS256',
      attrs,
    );

    const currentKey = await this.keyService.create(
      { tenant: tenant.id },
      {
        ...key1,
        current: true,
        next: false,
      },
    );

    const nextKey = await this.keyService.create(
      { tenant: tenant.id },
      {
        ...key2,
        current: false,
        next: true,
      },
    );
  }
}
