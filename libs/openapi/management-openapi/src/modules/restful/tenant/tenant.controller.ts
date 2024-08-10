import {
  Controller,
  Patch,
  Get,
  Body,
  Inject,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { 
  ITenantService,
  IKeyService,
  IOrganizationService,
} from 'libs/api/infra-api/src';
import {
  TenantDto,
  UpdateTenantDto,
} from 'libs/dto/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { AuthGuard } from '@nestjs/passport';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';

@Controller('api/v2/tenants')
@ApiTags('租户')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class TenantController {
  constructor(
    @Inject('ITenantService')
    private readonly tenantService: ITenantService,
    @Inject('IKeyService')
    private readonly keyService: IKeyService,
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
  ) {}

  @Get('settings')
  @ApiOperation({ summary: '获取当前租户详情', description: '获取当前租户详情' })
  @ApiOkResponse({ type: TenantDto })
  @Scopes('read:tenant_settings')
  async settingsGet(@ReqCtx() ctx: IRequestContext): Promise<TenantDto | undefined> {
    const tenant =  await this.tenantService.retrieve({}, ctx.tenant);
    if (!tenant) throw new NotFoundException();
    return tenant as any;
  }

  @Patch('settings')
  @ApiOperation({ summary: '更新租户', description: '更新租户' })
  @ApiOkResponse({ type: TenantDto })
  @Scopes('update:tenant_settings')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Body() input: UpdateTenantDto,
  ): Promise<TenantDto | null> {
    const existingTenant = await this.tenantService.retrieve({}, ctx.tenant);
    if (!existingTenant) {
      throw new NotFoundException('未找到租户');
    }

    const tenant = await this.tenantService.update(
      {},
      existingTenant.id,
      input,
    );

    const signingKeys = await this.keyService.findAll({ tenant: tenant.name });
    tenant.signing_keys = signingKeys;
    return tenant as any;
  }
}
