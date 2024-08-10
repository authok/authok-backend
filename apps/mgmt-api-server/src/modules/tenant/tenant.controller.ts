import { Controller, Get, Inject, Req, NotFoundException, Post, Body, Patch, Query } from "@nestjs/common";
import { OIDCRequest } from "../../types/oidc";
import { ConfigService } from "@nestjs/config";
import { ApiOperation } from "@nestjs/swagger";
import { IRequestContext, ReqCtx } from "@libs/nest-core";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { 
  CreateTenantDto, 
  TenantDto, 
  UpdateTenantDto, 
  RoleDto, 
  RolePageQueryDto, 
  OrganizationMemberDto, 
  OrganizationMemberPageQueryDto,
} from "libs/dto/src";
import {
  IUserService,
  ITenantService,
  IRoleService, 
  IOrganizationMemberService,
  ITenantManager,
} from "libs/api/infra-api/src";

@Controller('/api/v2/tenants')
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

    const domain = `${tenant.name}.${tenant.region}.${this.configService.get('domain', 'authok.io')}`;
    return {...tenant, domain } as any;
  }

  @Patch('settings')
  async settingsPatch(
    @ReqCtx() ctx: IRequestContext,
    @Body() data: UpdateTenantDto,
  ): Promise<TenantDto> {
    const existingTenant = await this.tenantService.retrieve({}, ctx.tenant);
    if (!existingTenant) throw new NotFoundException(`tenant ${ctx.tenant} not found`);

    const tenant = await this.tenantService.update({}, existingTenant.id, data);

    const domain = `${tenant.name}.${tenant.region}.${this.configService.get('domain', 'authok.io')}`;
    return {...tenant, domain } as any;
  }

  @Post()
  async create(@ReqCtx() ctx: IRequestContext, @Body() _tenant: CreateTenantDto): Promise<TenantDto> {
    const tenant =  await this.tenantManager.create(ctx, _tenant);
    const domain = `${tenant.name}.${tenant.region}.${this.configService.get('domain')}`;

    return {...tenant, domain } as any;
  }

  @Get()
  @ApiOperation({ summary: 'List tenants of current user' })
  async listTenants(
    @Req() req: OIDCRequest,
  ): Promise<TenantDto[]> {
    const tenant = this.configService.get('management.tenant');

    const page = await this.userService.listOrganizations({ tenant },
      req.user.sub, 
      {
        per_page: 100,
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
    ) as any;
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