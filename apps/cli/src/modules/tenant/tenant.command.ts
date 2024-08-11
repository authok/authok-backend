import { Inject, Injectable, Logger } from '@nestjs/common';
import { Command, Option } from 'nestjs-command';
import {
  ITenantService,
  ResourceServerModel,
  UpdateResourceServerModel,
  IResourceServerService,
  IRoleService,
  IOrganizationService,
  TenantModel,
  ITenantManager,
} from 'libs/api/infra-api/src';
import { managementApiScopes } from 'libs/core/infra-core/src/resource-server/management.api.scopes';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TenantCommand {
  constructor(
    @Inject('ITenantManager')
    private readonly tenantManager: ITenantManager,
    @Inject('ITenantService')
    private readonly tenantService: ITenantService,
    @Inject('IResourceServerService')
    private readonly resourceServerService: IResourceServerService,
    @Inject('IRoleService')
    private readonly roleService: IRoleService,
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
    private readonly configSerivce: ConfigService,
  ) {}

  @Command({
    command: 'create:tenant',
    describe: 'Create a Tenant',
  })
  async create(
    @Option({
      name: 'name',
      describe: 'Name (Unique)',
      type: 'string',
      alias: 'name',
      required: true,
    })
    name: string,
    @Option({
      name: 'region',
      describe: 'Region',
      type: 'string',
      alias: 'region',
      required: true,
    })
    region: string,
  ) {
    await this.tenantManager.create(
      {},
      {
        name,
        region,
      },
    );

    Logger.log('Tenant Created');
  }

  @Command({
    command: 'create:mgmt_tenant',
    describe: '创建管理平台租户',
  })
  async createManagementTenant(
    @Option({
      name: 'name',
      describe: '租户唯一标识符',
      type: 'string',
      alias: 'name',
      required: true,
    })
    name: string,
    @Option({
      name: 'region',
      describe: '租户所在区域',
      type: 'string',
      alias: 'region',
      required: true,
    })
    region: string,
  ) {
    const tenant = await this.tenantService.create(
      {},
      {
        name,
        region,
      },
    );

    Logger.log('租户创建成功: ', tenant)
    const org = await this.organizationService.create(
      { tenant: tenant.id },
      {
        id: tenant.id,
        name,
      },
    );

    const resourceServer = await this.createManagementApi(tenant);

    await this.addRoles(tenant, resourceServer);

    Logger.log('Management Tenant Created');
  }

  async createManagementApi(tenant: TenantModel) {
    const domain = this.configSerivce.get('domain', 'authok.io');

    const mgmtResourceServer = await this.resourceServerService.create(
      { tenant: tenant.id },
      {
        name: 'Dashboard Management API',
        identifier: `https://mgmt.${tenant.region}.${domain}/api/v2/`,
        is_system: false,
        allow_offline_access: true,
        skip_consent_for_verifiable_first_party_clients: true,
        token_lifetime: 86400,
        enforce_policies: true,
        token_lifetime_for_web: 7200,
        scopes: managementApiScopes,
      },
    );
    Logger.log(`为租户: ${tenant.name} 创建了管理API: ${mgmtResourceServer.id}`);

    return mgmtResourceServer;
  }

  async addRoles(tenant: TenantModel, resourceServer: ResourceServerModel) {
    Logger.debug('给管理租户创建默认角色');
    const role = await this.roleService.create(
      { tenant: tenant.id },
      {
        name: 'Admin',
        description: 'Admin',
      },
    );

    Logger.debug('给管理租户默认角色添加权限');
    await this.roleService.addPermissions({ tenant: tenant.id }, role.id, {
      permissions: resourceServer.scopes.map((it) => ({
        resource_server_identifier: resourceServer.identifier,
        permission_name: it.value,
      })),
    });
  }

  @Command({
    command: 'update:permissions',
    describe: '更新系统API权限',
  })
  async updatePermissions() {
    const tenant = 'org_5MpprRSVPhC3M75GPENKi0nb';

    await this.resourceServerService.update(
      { tenant },
      'x-rGkX-xNQfQN3rWLLGfr',
      {
        scopes: managementApiScopes,
      } as UpdateResourceServerModel,
    );
  }
}
