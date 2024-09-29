import {
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { 
  TenantModel, 
  CreateTenantModel,
  OrganizationModel,
  ITenantService,
  IResourceServerService,
  IOrganizationService,
  IRoleService,
  IOrganizationMemberService,
  ITenantManager,
  IConnectionService,
  IClientService,
  IClientGrantService,
  IKeyService,
  ITriggerService,
  CreateResourceServerModel, 
  ResourceServerModel,
} from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import assert from 'node:assert';
import { SigningKeyGenerator } from 'libs/shared/src/key-generator/key.generator';
import { managementApiScopes } from '@libs/core/infra-core/resource-server/management.api.scopes';

@Injectable()
export class TenantManager implements ITenantManager {
  constructor(
    private readonly configService: ConfigService,
    @Inject('ITenantService')
    private readonly tenantService: ITenantService,
    @Inject('IResourceServerService')
    private readonly resourceServerService: IResourceServerService,
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
    @Inject('IOrganizationMemberService')
    private readonly organizationMemberService: IOrganizationMemberService,
    @Inject('IRoleService')
    private readonly roleService: IRoleService,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IClientService') private readonly clientService: IClientService,
    @Inject('IClientGrantService')
    private readonly clientGrantService: IClientGrantService,
    @Inject('IKeyService') private readonly keyService: IKeyService,
    private readonly signingKeyGenerator: SigningKeyGenerator,
    @Inject('ITriggerService') private readonly triggerService: ITriggerService,
  ) {}

  async create(
    ctx: IContext,
    _tenant: CreateTenantModel,
  ): Promise<TenantModel> {
    const mgmtTenant = this.configService.get('management.tenant');
    const audience = this.configService.get('management.audience');

    console.log('mgmtTenant: ', mgmtTenant)

    // 查找看是否存在
    const existingTenant = await this.tenantService.findByName(ctx, _tenant.name);
    if (existingTenant) {
      throw new ConflictException(`同名租户已经存在`);
    }

    const tenant = await this.tenantService.create(ctx, { ..._tenant });

    Logger.log('创建租户关联的组织');
    const org = await this.organizationService.create({ tenant: mgmtTenant }, {
      id: _tenant.id,
      name: _tenant.name,
      display_name: _tenant.display_name,
    } as OrganizationModel);

    try {
      const mgmtResourceServer = await this.resourceServerService.findByIdentifier({ tenant: mgmtTenant }, audience);
      if (!mgmtResourceServer) {
        Logger.error(`管理平台API (${audience}) 缺失, 需要构建`);
        throw new InternalServerErrorException('管理平台API缺失');
      }

      const creator = ctx.req?.user
      if (creator) {
        Logger.log(`>> tenant ${tenant.id} creating steps 1: 把创建者 ${creator.user_id} 加入租户组织`);
        await this.addCreatorToTenantOrg(creator, tenant, org)
      } else {
        Logger.warn('没有创建者');
      }

      Logger.log(`>> tenant ${tenant.id} creating steps: 创建 signing keys`);
      await this.createSigningKeys(tenant);

      Logger.log(`>> tenant ${tenant.id} creating steps: 创建 triggers`);
      await this.createTriggers(tenant);

      Logger.log(`>> tenant ${tenant.id} creating steps: 创建 Management API`);
      const api = await this.createManagementAPI(tenant)

      Logger.log(`>> tenant ${tenant.id} creating steps: 创建 默认应用 (需要改成异步事件驱动)`);
      await this.createDefaultApp(tenant, api);

      Logger.log(`>> tenant ${tenant.id} creating steps.创建 默认身份源 (需要改成异步事件驱动)`);
      await this.createConnections(tenant);

      return tenant;
    } catch(e) {
      Logger.error(e);
      throw e;
    }
  }

  // 把当前用户加入租户对应的组织
  private async addCreatorToTenantOrg(creator: Record<string, any>, tenant: TenantModel, org: OrganizationModel) {
    const mgmtTenant = this.configService.get('management.tenant');

    const user_id = creator.user_id || creator.sub;
    Logger.warn(`为创建者: ${user_id} 建立成员关系: (org_id: ${org.id}, member_id: ${user_id})`);

    // 把当前用户添加为组织成员
    const members = await this.organizationService.addMembers({ tenant: mgmtTenant }, org.id, [user_id]);
    assert(members && members.length > 0, "add members error")

    const member_id = members[0].id;
    const rolePage = await this.roleService.paginate({ tenant: mgmtTenant }, {});
    Logger.debug(`为创建者: ${user_id} 添加管理员角色: ${rolePage.items.map(it => it.id).join(' ')}`);

    await this.organizationMemberService.addRoles({ tenant: mgmtTenant }, member_id, rolePage.items.map(it => it.id));
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

  async createManagementAPI(tenant: TenantModel): Promise<ResourceServerModel> {
    const region = tenant.region ?? 'us';

    const domain = this.configService.get('domain', 'authok.io')

    const resourceServer = await this.resourceServerService.create(
      { tenant: tenant.id },
      {
        name: 'Authok Management API',
        identifier: `https://${tenant.name}.${region}.${domain}/api/v2/`,
        is_system: true,
        allow_offline_access: true,
        skip_consent_for_verifiable_first_party_clients: false,
        token_lifetime: 86400,
        token_lifetime_for_web: 7200,
        scopes: managementApiScopes,
      } as CreateResourceServerModel,
    );
    
    Logger.log(`为租户: ${tenant.name} 创建了 Management API: ${resourceServer.id}, ${resourceServer.identifier}`);
    Logger.log('ResourceServer.scopes: ', resourceServer.scopes.map((it) => it.value));
    return resourceServer;
  }

  async createDefaultApp(tenant: TenantModel, resourceServer: ResourceServerModel) {
    const client = await this.clientService.create(
      { tenant: tenant.id },
      {
        name: 'ManagementAPI App',
        app_type: 'non_interactive',
        token_endpoint_auth_method: 'client_secret_post',
      },
    );
    Logger.log(`应用 ${client.client_id} 已创建`)

    await this.clientGrantService.create(
      { tenant: tenant.id },
      {
        client_id: client.client_id,
        audience: resourceServer.identifier,
        scope: resourceServer.scopes.map((it) => it.value),
      },
    );
    Logger.log(`应用授权已创建`)
  }

  async createConnections(tenant: TenantModel) {
    await this.connectionService.create(
      { tenant: tenant.id },
      {
        name: 'sms',
        display_name: 'Sms',
        strategy: 'sms',
      },
    );

    await this.connectionService.create(
      { tenant: tenant.id },
      {
        name: 'email',
        display_name: 'Email',
        strategy: 'email',
      },
    );

    await this.connectionService.create(
      { tenant: tenant.id },
      {
        name: 'database',
        display_name: 'Database',
        strategy: 'authok',
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
