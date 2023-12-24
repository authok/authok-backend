import { Controller, Get, Inject, Req, NotFoundException, Post, Body, Patch, InternalServerErrorException, Logger, Query } from "@nestjs/common";
import { ITenantService } from "libs/api/infra-api/src/tenant/tenant.service";
import { OIDCRequest } from "../../types/oidc";
import { ConfigService } from "@nestjs/config";
import { CreateTenantDto, TenantDto, UpdateTenantDto } from "libs/api/infra-api/src/tenant/tenant.dto";
import { IUserService } from "libs/api/infra-api/src/user/user.service";
import { ApiOperation } from "@nestjs/swagger";
import { IRequestContext, ReqCtx } from "@libs/nest-core";
import { ITenantManager } from "libs/api/infra-api/src/tenant/tenant.manager";
import { OrganizationMemberDto } from "libs/api/infra-api/src/organization/organization-member.dto";
import { OrganizationMemberPageQueryDto } from "libs/api/infra-api/src/organization/organization.dto";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { IOrganizationMemberService } from "libs/api/infra-api/src/organization/organization-member.service";
import { RoleDto, RolePageQueryDto } from "libs/api/infra-api/src/role/role.dto";
import { IRoleService } from "libs/api/infra-api/src/role/role.service";

@Controller('/api/v1/tenants')
export class TenantController {
  constructor(
    @Inject('ITenantService') private readonly tenantService: ITenantService,
    @Inject('ITenantManager') private readonly tenantManager: ITenantManager,
    private readonly configService: ConfigService,
    @Inject('IUserService') private readonly userService: IUserService,
    @Inject('IOrganizationMemberService') private readonly organizationMemberService: IOrganizationMemberService,
    @Inject('IRoleService') private readonly roleService: IRoleService,
  ) {}

  @Get('settings')
  async settingsGet(@ReqCtx() ctx: IRequestContext): Promise<TenantDto | undefined> {
    const tenant =  await this.tenantService.retrieve({}, ctx.tenant);
    if (!tenant) throw new NotFoundException(`tenant ${ctx.tenant} not found`);

    const domain = `${tenant.name}.${tenant.region}.${this.configService.get('domain')}`;
    return {...tenant, domain };
  }

  @Patch('settings')
  async settingsPatch(
    @ReqCtx() ctx: IRequestContext,
    @Body() data: UpdateTenantDto,
  ): Promise<TenantDto> {
    const existingTenant = await this.tenantService.retrieve({}, ctx.tenant);
    if (!existingTenant) throw new NotFoundException(`tenant ${ctx.tenant} not found`);

    const tenant = await this.tenantService.update({}, existingTenant.id, data);

    const domain = `${tenant.name}.${tenant.region}.${this.configService.get('domain')}`;
    return {...tenant, domain };
  }

  @Post()
  async create(@ReqCtx() ctx: IRequestContext, @Body() _tenant: CreateTenantDto): Promise<TenantDto> {
    const tenant =  await this.tenantManager.create(ctx, _tenant);
    const domain = `${tenant.name}.${tenant.region}.${this.configService.get('domain')}`;

    return {...tenant, domain };
  }

  @Get()
  @ApiOperation({ summary: '获取当前用户的租户列表' })
  async listTenants(
    @Req() req: OIDCRequest,
  ): Promise<TenantDto[]> {
    const tenant = this.configService.get('management.tenant');

    const page = await this.userService.listOrganizations({ tenant },
      req.user.sub, 
      {
        page_size: 100,
      }
    );

    const organizations = page.items;

    return organizations.map(it => ({
      id: it.id,
      name: it.name,
      display_name: it.display_name,
      region: it.metadata?.region || 'cn',
    }) as TenantDto);
  }

  @Get('members')
  @ApiOperation({ summary: '获取当前租户的管理员列表' })
  async listMembers(
    @Req() req: OIDCRequest,
    @Query() query: OrganizationMemberPageQueryDto,
  ): Promise<PageDto<OrganizationMemberDto>> {
    const tenant = this.configService.get('management.tenant');

    return await this.organizationMemberService.paginate(
      { tenant },
      {...query, org_id: req.user.org_id },
    );
  }

  @Get('roles')
  async listRoles(
    @Req() req: OIDCRequest,
    @Query() query: RolePageQueryDto,
  ): Promise<PageDto<RoleDto>> {
    const tenant = this.configService.get('management.tenant');

    return await this.roleService.paginate(
      { tenant },
      query,
    );
  }
}