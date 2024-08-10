import { Controller, Get, Inject, Req, NotFoundException, Post, Body, Patch, Put, Param, UseGuards } from "@nestjs/common";
import { ConfigDto, FactorDto, FactorProviderDto, FactorConfigDto } from "libs/dto/src";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { IConfigService } from "libs/api/infra-api/src";
import { plainToClass } from "class-transformer";
import { TenantGuard } from "../../middleware/tenant.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";
import { ConfigService } from "@nestjs/config";

@Controller('/api/v2/guardian/factors')
@UseGuards(TenantGuard)
export class FactorController {
  constructor(
    @Inject('IConfigService') private readonly configService: IConfigService,
    private readonly _configService: ConfigService,
  ) {}

  @Get('configs/:factor')
  @Scopes('read:guardian_factors')
  async getFactorConfig(
    @ReqCtx() ctx: IRequestContext,
    @Param('factor') factor: string,
  ): Promise<FactorConfigDto | undefined> {
    const namespace = `mfa-factor-config`;
    const config = await this.configService.get(ctx, namespace, factor);

    return config;
  }

  @Get('configs')
  @Scopes('read:guardian_factors')
  async getFactorConfigs(
    @ReqCtx() ctx: IRequestContext,
  ): Promise<FactorConfigDto[] | undefined> {
    const query = {
      namespace: `mfa-factor-config`,
      per_page: 100,
    };
    const page = await this.configService.paginate(ctx, query);

    return page.items;
  }

  @Put('configs/:factor')
  @Scopes('update:guardian_factors')
  async updateFactorConfig(
    @ReqCtx() ctx: IRequestContext,
    @Param('factor') factor: string,
    @Body() body: ConfigDto,
  ): Promise<ConfigDto> {
    console.log('body: ', body);
    const namespace = `mfa-factor-config`;
    return await this.configService.set(ctx, namespace, factor, body);
  }

  @Get()
  @Scopes('read:guardian_factors')
  async getAll(@ReqCtx() ctx: IRequestContext): Promise<FactorDto[] | undefined> {
    const tenant = this._configService.get('management.tenant');

    const namespace = 'mfa-factor-template';
    const page = await this.configService.paginate({ tenant }, {
      namespace,
      per_page: 100,
    });

    return page.items.map(it => plainToClass(FactorDto, it.value));
  }

  @Get(':factor')
  @Scopes('read:guardian_factors')
  async get(@ReqCtx() ctx: IRequestContext, @Param('factor') factor: string): Promise<FactorDto | undefined> {
    const tenant = this._configService.get('management.tenant');

    const namespace = 'mfa-factor-template';
    const config = await this.configService.get({ tenant }, namespace, factor);
    if (!config) return undefined;

    return plainToClass(FactorDto, config.value);
  }

  @Get(':factor/providers')
  @Scopes('read:guardian_factors')
  async getProviders(@ReqCtx() ctx: IRequestContext, @Param('factor') factor: string): Promise<FactorProviderDto[] | undefined> {
    const tenant = this._configService.get('management.tenant');

    const namespace = `mfa-factor-${factor}-provider`;
    const page = await this.configService.paginate({ tenant }, {
      namespace,
      per_page: 100,
    });

    return page.items.map(it => plainToClass(FactorProviderDto, it.value));
  }

  @Get(':factor/providers/:provider')
  @Scopes('read:guardian_factors')
  async getProvider(@ReqCtx() ctx: IRequestContext, @Param('factor') factor: string, @Param('provider') provider: string): Promise<FactorProviderDto | undefined> {
    const tenant = this._configService.get('management.tenant');

    const namespace = `mfa-factor-${factor}-provider`;
    const config = await this.configService.get({ tenant }, namespace, provider);
    if (!config) return undefined;

    return plainToClass(FactorProviderDto, config.value);
  }
}