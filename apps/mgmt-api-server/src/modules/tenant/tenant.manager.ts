import {
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  ConflictException,
} from '@nestjs/common';

import { ITenantService } from 'libs/api/infra-api/src/tenant/tenant.service';
import {
  TenantDto, CreateTenantDto,
} from 'libs/api/infra-api/src/tenant/tenant.dto';
import { ConfigService } from '@nestjs/config';
import { IResourceServerService } from 'libs/api/infra-api/src/resource-server/resource-server.service';
import { OrganizationDto } from 'libs/api/infra-api/src/organization/organization.model';
import { IOrganizationService } from 'libs/api/infra-api/src/organization/organization.service';
import { IRoleService } from 'libs/api/infra-api/src/role/role.service';
import { IOrganizationMemberService } from 'libs/api/infra-api/src/organization/organization-member.service';
import { ITenantManager } from 'libs/api/infra-api/src/tenant/tenant.manager';
import { IContext } from '@libs/nest-core';

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
  ) {}

  async create(
    ctx: IContext,
    _tenant: CreateTenantDto,
  ): Promise<TenantDto> {
    const mgmtTenant = this.configService.get('management.tenant');

    // 查找看是否存在
    const existingTenant = await this.tenantService.findByName(ctx, _tenant.name);
    if (existingTenant) {
      throw new ConflictException(`同名租户已经存在`);
    }

    Logger.debug('创建租户关联的组织');
    const org = await this.organizationService.create({ tenant: mgmtTenant }, {
      id: _tenant.name,
      name: _tenant.name,
      display_name: _tenant.display_name,
    } as OrganizationDto);

    const tenant = await this.tenantService.create(ctx, { id: org.id, ..._tenant });

    console.log('创建者: ', ctx.req?.user);
    await this.initTenant(ctx.req?.user, tenant, org)

    return tenant;
  }


  private async initTenant(creator: Record<string, any>, tenant: TenantDto, org: OrganizationDto) {
    const mgmtTenant = this.configService.get('management.tenant');
    const audience = this.configService.get('management.audience');

    const mgmtResourceServer = await this.resourceServerService.findByIdentifier({ tenant: mgmtTenant }, audience);
    if (!mgmtResourceServer) {
      Logger.error(`管理平台API (${audience}) 缺失, 需要构建`);
      throw new InternalServerErrorException('管理平台API缺失');
    }

    // 把当前用户加入租户对应的组织
    if (creator) {
      const user_id = creator.user_id || creator.sub;

      Logger.warn(`为创建者: ${user_id} 建立成员关系: (org_id: ${org.id}, member_id: ${user_id})`);

      const members = await this.organizationService.addMembers({ tenant: mgmtTenant }, org.id, [user_id]);
      if (members && members.length > 0) {
        const member_id = members[0].id;

        const rolePage = await this.roleService.paginate({ tenant: mgmtTenant }, {});
        Logger.debug(`为创建者: ${user_id} 添加管理员角色: ${rolePage.items.map(it => it.id).join(' ')}`);
  
        await this.organizationMemberService.addRoles({ tenant: mgmtTenant }, member_id, rolePage.items.map(it => it.id));
      }
    } else {
      Logger.warn('没有创建者');
    }
  }
}
