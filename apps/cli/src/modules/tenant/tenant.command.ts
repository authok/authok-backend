import { Inject, Injectable, Logger } from '@nestjs/common';
import { Command, Option } from 'nestjs-command';
import { ITenantService } from 'libs/api/infra-api/src/tenant/tenant.service';
import {
  CreateResourceServerDto,
  ResourceServerDto,
  UpdateResourceServerDto,
} from 'libs/api/infra-api/src/resource-server/resource-server.dto';
import { IResourceServerService } from 'libs/api/infra-api/src/resource-server/resource-server.service';
import { managementApiScopes } from 'libs/core/infra-core/src/resource-server/management.api.scopes';
import { TenantDto } from 'libs/api/infra-api/src/tenant/tenant.dto';
import { IRoleService } from 'libs/api/infra-api/src/role/role.service';
import { ITenantManager } from 'libs/api/infra-api/src/tenant/tenant.manager';
import { IOrganizationService } from 'libs/api/infra-api/src/organization/organization.service';

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
  ) {}

  @Command({
    command: 'create:tenant',
    describe: '创建租户',
  })
  async create(
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
    await this.tenantManager.create(
      {},
      {
        name,
        region,
      },
    );

    console.log('xxx 创建成功');
    const sleep = (timeout: number) =>
      new Promise((resolver) => setTimeout(resolver, timeout));
    await sleep(20000);
    console.log('xxx 等待完毕');
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
    const mgmtTenantId = 'org_1';
    // const tenant = { id: mgmtTenantId } as TenantDto;
    const tenant = await this.tenantService.create(
      { tenant: mgmtTenantId },
      {
        id: mgmtTenantId,
        name,
        region,
      },
    );

    const org = await this.organizationService.create(
      { tenant: mgmtTenantId },
      {
        id: mgmtTenantId,
        name,
      },
    );

    const resourceServer = await this.createManagementApi(tenant);
    // const resourceServer = await this.resourceServerService.findByIdentifier({ tenant: tenant.name }, 'https://mgmt.authok.cn/api');

    await this.addRoles(tenant, resourceServer);

    console.log('管理租户 创建成功');
    const sleep = (timeout: number) =>
      new Promise((resolver) => setTimeout(resolver, timeout));
    await sleep(20000);
    console.log('xxx 等待完毕');
  }

  async createManagementApi(tenant: TenantDto) {
    const api = {
      name: 'Dashboard Management API',
      identifier: `https://mgmt.authok.cn/api/v1/`,
      is_system: false,
      allow_offline_access: true,
      skip_consent_for_verifiable_first_party_clients: true,
      token_lifetime: 86400,
      enforce_policies: true,
      token_lifetime_for_web: 7200,
      scopes: managementApiScopes,
    } as CreateResourceServerDto;
    const mgmtResourceServer = await this.resourceServerService.create(
      { tenant: tenant.id },
      api,
    );
    Logger.log(
      `为租户: ${tenant.name} 创建了管理API: ${mgmtResourceServer.id}`,
    );

    return mgmtResourceServer;
  }

  async addRoles(tenant: TenantDto, resourceServer: ResourceServerDto) {
    Logger.debug('给管理租户创建默认角色');
    const role = await this.roleService.create(
      { tenant: tenant.id },
      {
        name: '管理员',
        description: '管理员',
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
      } as UpdateResourceServerDto,
    );
  }
}
