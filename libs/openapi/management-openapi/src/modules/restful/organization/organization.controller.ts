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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  OrganizationDto,
  CreateOrganizationDto,
  OrganizationPageQueryDto,
  UpdateOrganizationDto,
  OrganizationEnabledConnectionDto,
} from 'libs/dto/src';
import { IOrganizationService } from 'libs/api/infra-api/src';
import {
  PageDto,
  PageQueryDto,
} from 'libs/common/src/pagination';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { AuthGuard } from '@nestjs/passport';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';

@Controller('/api/v2/organizations')
@ApiTags('组织')
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
export class OrganizationController {
  constructor(
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取所有组织' })
  @Scopes('read:organizations')
  async getOrganizations(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: OrganizationPageQueryDto,
  ): Promise<PageDto<OrganizationDto>> {
    return await this.organizationService.paginate(ctx, query);
  }

  @ApiOperation({
    summary: '创建组织',
    description: '创建组织',
  })
  @Post()
  @Scopes('create:organizations')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() body: CreateOrganizationDto,
  ): Promise<OrganizationDto | undefined> {
    return this.organizationService.create(ctx, body);
  }

  @ApiOperation({ summary: '获取一个组织', description: '获取一个组织' })
  @Get(':id')
  @Scopes('read:organizations')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<OrganizationDto | undefined> {
    return await this.organizationService.retrieve(ctx, id);
  }

  @ApiOperation({ summary: '根据名称获取一个组织' })
  @Get('name/:name')
  @Scopes('read:organizations')
  async findByName(
    @ReqCtx() ctx: IRequestContext,
    @Param('name') name: string,
  ): Promise<OrganizationDto | undefined> {
    return await this.organizationService.findByName(ctx, name);
  }

  @ApiOperation({ summary: '删除一个组织', description: '更新组织' })
  @Delete(':id')
  @Scopes('delete:organizations')
  async delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string) {
    return await this.organizationService.delete(ctx, id);
  }

  @ApiOperation({ summary: '更新组织', description: '更新组织' })
  @Patch(':id')
  @Scopes('update:organizations')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() body: UpdateOrganizationDto,
  ) {
    return await this.organizationService.update(ctx, id, body);
  }

  @ApiOperation({
    summary: '获取组织开启的身份源',
    description: '获取组织开启的身份源',
  })
  @Get(':id/enabled_connections')
  @Scopes('update:organizations')
  async enabledConnectionsGet(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Query() query: PageQueryDto,
  ): Promise<PageDto<OrganizationEnabledConnectionDto>> {
    // TODO
    // return this.organizationService.paginateConnections(ctx, id, query);
    return this.organizationService.enabledConnections(ctx, id);
  }
}
