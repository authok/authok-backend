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
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';

import { IResourceServerService } from 'libs/api/infra-api/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { AuthGuard } from '@nestjs/passport';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { PageDto, pageDtoFactory } from 'libs/common/src/pagination';
import { 
  ResourceServerDto, 
  ResourceServerPageQueryDto, 
  CreateResourceServerDto, 
  UpdateResourceServerDto,
} from 'libs/dto/src';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';

@ApiTags('资源服务器 - API')
@Controller('/api/v2/resource-servers')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiTags('应用')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class ResourceServerController {
  constructor(
    @Inject('IResourceServerService')
    private readonly resourceServerService: IResourceServerService,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取API列表', description: '获取API列表' })
  @ApiOkResponse({ type: pageDtoFactory(ResourceServerDto) })
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

  @ApiOperation({ summary: '创建API', description: '创建API' })
  @ApiOkResponse({ type: ResourceServerDto })
  @Post()
  @Scopes('read:resource_servers')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() req: CreateResourceServerDto,
  ): Promise<ResourceServerDto | undefined> {
    const resourceServer = await this.resourceServerService.create(ctx, req);

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

  @Get('/:id')
  @ApiOperation({ summary: '获取一个资源服务器', description: '获取一个资源服务器' })
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

  @ApiOperation({ summary: '删除给定API', description: '删除给定API' })
  @Delete('/:id')
  @Scopes('delete:resource_servers')
  async delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string) {
    return await this.resourceServerService.delete(ctx, id);
  }

  @ApiOperation({ summary: '更新给定API', description: '更新给定API' })
  @ApiOkResponse({ type: ResourceServerDto })
  @ApiParam({
    name: 'id',
    description: 'API ID'
  })
  @Patch('/:id')
  @Scopes('update:resource_servers')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() data: UpdateResourceServerDto,
  ) {
    return await this.resourceServerService.update(ctx, id, data);
  }
}
