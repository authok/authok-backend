import { Controller, Get, Req, Inject, Body, Param, NotFoundException, Patch, Delete, UseGuards, Query, ValidationPipe } from "@nestjs/common";
import { OIDCRequest } from "../../types/oidc";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";
import { IConfigService } from "libs/api/infra-api/src";
import { ConfigDto, ConfigPageQueryDto } from "libs/dto/src";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { plainToClass } from "class-transformer";
import validateConfig from "./config.schema";
import { TenantGuard } from "../../middleware/tenant.guard";
import { ReqCtx, IRequestContext } from "@libs/nest-core";
import { ConfigService } from "@nestjs/config";

// 这个不对外
@Controller('/api/v2/configs')
@UseGuards(ScopesGuard)
@UseGuards(TenantGuard)
export class ConfigController {
  constructor(
    @Inject('IConfigService')
    private readonly configService: IConfigService,
    private readonly _configService: ConfigService,
  ) {}
  @Get(':namespace/:name')
  // @Scopes('read:organizations')
  async get(@Req() req: OIDCRequest, @Param('namespace') _namespace: string, @Param('name') name: string, @Query('global') global: boolean): Promise<ConfigDto | undefined> {        
    let namespace = _namespace;
    let tenant = req.user.org_id;
    if (global) {
      tenant = this._configService.get('management.tenant');
      namespace = _namespace + '-global' 
    }

    const config = await this.configService.get({ tenant }, namespace, name);
    return plainToClass(ConfigDto, config);
  }

  @Patch(':namespace/:name')
  // @Scopes('update:organizations')
  async set(@ReqCtx() ctx: IRequestContext, @Param('namespace') namespace: string, @Param('name') name: string, @Body() data: ConfigDto): Promise<ConfigDto> {
    const value = validateConfig(namespace, name, data.value);
    
    const config = await this.configService.set(ctx, namespace, name, { ...data, value} );
    return plainToClass(ConfigDto, config);
  }

  @Get()
  async paginate(@Req() req: OIDCRequest, @Query() query: ConfigPageQueryDto): Promise<PageDto<ConfigDto>> {
    let tenant = req.user.org_id;
    if (query.global) {
      tenant = this._configService.get('management.tenant');
    }

    if (Array.isArray(query.name)) {
      query.name = query.name.map(it => `${it}-global`);
    } else if (query.name) {
      query.name = `${query.name}-global`;
    }

    if (Array.isArray(query.namespace)) {
      query.namespace = query.namespace.map(it => `${it}-global`);
    } else if (query.namespace) {
      query.namespace = `${query.namespace}-global`;
    }

    const page = await this.configService.paginate({ tenant }, query);
    return {
      items: page.items.map(it => plainToClass(ConfigDto, it)),
      meta: page.meta,
    };
  }
}