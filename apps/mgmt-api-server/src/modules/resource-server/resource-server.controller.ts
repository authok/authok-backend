import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  Patch,
  Inject,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { 
  IResourceServerService,
  ITenantService,
} from 'libs/api/infra-api/src';
import { 
  ResourceServerPageQueryDto, 
  ResourceServerDto, 
  UpdateResourceServerDto,
} from 'libs/dto/src';
import { Throttle, seconds } from '@nestjs/throttler';
import { PageDto } from 'libs/common/src/pagination/pagination.dto';
import { OIDCRequest } from '../../types/oidc';
import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import axios from 'axios';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { TenantGuard } from '../../middleware/tenant.guard';
import { ReqCtx, IRequestContext } from '@libs/nest-core';
import { ConfigService } from '@nestjs/config';

@JoiSchemaOptions({
  allowUnknown: false,
})
class TokenRequestDto {
  @JoiSchema(Joi.string().required())
  audience: string;

  @JoiSchema(Joi.string().required())
  client_id: string;

  @JoiSchema(Joi.string().required())
  client_secret: string;
}

@ApiTags('资源服务器 - API')
@Controller('/api/v2/resource-servers')
@Throttle({
  default: {
    limit: 3,
    ttl: seconds(1),
  }
})
@UseGuards(TenantGuard)
@UseGuards(ScopesGuard)
export class ResourceServerController {
  constructor(
    @Inject('IResourceServerService')
    private readonly resourceServerService: IResourceServerService,
    @Inject('ITenantService')
    private readonly tenantService: ITenantService,
    private readonly configService: ConfigService,
  ) {}

  @Post('token')
  @Scopes('read:resource_servers')
  async token(@Req() req: OIDCRequest, @Body() body: TokenRequestDto) {
    const tenant = await this.tenantService.retrieve({}, req.user.org_id)

    const domain = this.configService.get('domain', 'authok.io');

    const url = `https://${tenant.name}.${tenant.region}.${domain}/oauth/token`;
    console.log('url: ', url);

    const data = { ...body, grant_type: 'client_credentials' };
    const r = await axios.post(url, data);
    return r.data;
  }

  @Get()
  @ApiOperation({ summary: '获取列表' })
  @Scopes('read:resource_servers')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: ResourceServerPageQueryDto,
  ): Promise<PageDto<ResourceServerDto>> {
    const page = await this.resourceServerService.paginate(ctx, query);
    return {
      meta: page.meta,
      items: page.items.map((it) => ({
        id: it.id,
        name: it.name,
        is_system: it.is_system,
        identifier: it.identifier,
        scopes: it.scopes,
        signing_alg: it.signing_alg,
        signing_secret: it.signing_secret,
        allow_offline_access: it.allow_offline_access,
        skip_consent_for_verifiable_first_party_clients:
          it.skip_consent_for_verifiable_first_party_clients,
        token_lifetime: it.token_lifetime,
        token_lifetime_for_web: it.token_lifetime_for_web,
        enforce_policies: it.enforce_policies,
        token_dialect: it.token_dialect,
        client: it.client,
      })),
    };
  }

  @Post()
  @Scopes('create:resource_servers')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() body: ResourceServerDto,
  ): Promise<ResourceServerDto | undefined> {
    const resourceServer = await this.resourceServerService.create(ctx, body);

    return {
      id: resourceServer.id,
      name: resourceServer.name,
      is_system: resourceServer.is_system,
      identifier: resourceServer.identifier,
      scopes: resourceServer.scopes,
      signing_alg: resourceServer.signing_alg,
      signing_secret: resourceServer.signing_secret,
      allow_offline_access: resourceServer.allow_offline_access,
      skip_consent_for_verifiable_first_party_clients: resourceServer.skip_consent_for_verifiable_first_party_clients,
      token_lifetime: resourceServer.token_lifetime,
      token_lifetime_for_web: resourceServer.token_lifetime_for_web,
      enforce_policies: resourceServer.enforce_policies,
      token_dialect: resourceServer.token_dialect,
      client: resourceServer.client,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '获取一个资源服务器' })
  @ApiResponse({
    type: ResourceServerDto,
  })
  @Scopes('read:resource_servers')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ResourceServerDto | undefined> {
    const resourceServer = await this.resourceServerService.retrieve(ctx, id);
    if (!resourceServer) throw new NotFoundException(`找不到 给定 Resource Server: ${id}`);

    return {
      id: resourceServer.id,
      name: resourceServer.name,
      is_system: resourceServer.is_system,
      identifier: resourceServer.identifier,
      scopes: resourceServer.scopes,
      signing_alg: resourceServer.signing_alg,
      signing_secret: resourceServer.signing_secret,
      allow_offline_access: resourceServer.allow_offline_access,
      skip_consent_for_verifiable_first_party_clients: resourceServer.skip_consent_for_verifiable_first_party_clients,
      token_lifetime: resourceServer.token_lifetime,
      token_lifetime_for_web: resourceServer.token_lifetime_for_web,
      enforce_policies: resourceServer.enforce_policies,
      token_dialect: resourceServer.token_dialect,
      client: resourceServer.client,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  @Scopes('delete:resource_servers')
  async delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string) {
    return await this.resourceServerService.delete(ctx, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新' })
  @Scopes('update:resource_servers')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() data: UpdateResourceServerDto,
  ) {
    return this.resourceServerService.update(ctx, id, data);
  }
}