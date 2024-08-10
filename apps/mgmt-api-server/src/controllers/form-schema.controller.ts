import { Controller, Get, Post, Req, Inject, Query, Body, Param, Patch, NotFoundException } from "@nestjs/common";
import { OIDCRequest } from "../types/oidc";
import { IConfigService } from "libs/api/infra-api/src";
import { ConfigService } from "@nestjs/config";

@Controller('/api/v2/form-schemas')
export class FormSchemaController {
  constructor(
    @Inject('IConfigService') private readonly configService: IConfigService,
    private readonly _configService: ConfigService,
  ) {}

  @Get(':namespace/:name')
  async find(@Req() req: OIDCRequest, 
    @Param('namespace') _namespace: string,
    @Param('name') name: string,
  ): Promise<any | undefined> {
    const tenant = this._configService.get('management.tenant');

    const namespace = `form-schema-${_namespace}`;
    const config = await this.configService.get({ tenant }, namespace, name);
    if (!config) return new NotFoundException();

    return config.value;
  }
}