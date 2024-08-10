import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import {
  ClientGrantDto,
  ClientGrantPageQueryDto,
  PatchClientGrantDto,
} from 'libs/dto/src';
import { IClientGrantService } from 'libs/api/infra-api/src';
import { PageDto } from 'libs/common/src/pagination';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';

@Controller('/api/v2/client-grants')
@ApiTags('应用授权 - ClientGrant')
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
export class ClientGrantController {
  constructor(
    @Inject('IClientGrantService')
    private readonly clientGrantService: IClientGrantService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取ClientGrant', description: '根据ID获取ClientGrant' })
  @Scopes('read:client_grants')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ClientGrantDto | undefined> {
    return await this.clientGrantService.retrieve(ctx, id);
  }

  @ApiOperation({
    summary: '更新应用授权',
    description: '更新应用授权',
  })
  @Patch(':id')
  @Scopes('update:client_grants')
  async patch(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() body: PatchClientGrantDto,
  ) {
    return await this.clientGrantService.update(ctx, id, body);
  }

  @Delete(':id')
  @Scopes('delete:client_grants')
  async delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string) {
    return await this.clientGrantService.delete(ctx, id);
  }

  @ApiOperation({
    summary: '创建应用授权',
    description: '创建应用授权',
  })
  @Post()
  @Scopes('create:client_grants')
  async create(@ReqCtx() ctx: IRequestContext, @Body() body: ClientGrantDto) {
    return await this.clientGrantService.create(ctx, body);
  }

  @ApiOperation({
    summary: '分页查找应用授权',
    description: '分页查找应用授权',
  })
  @Get()
  @Scopes('read:client_grants')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: ClientGrantPageQueryDto,
  ): Promise<PageDto<ClientGrantDto>> {
    return await this.clientGrantService.paginate(ctx, query);
  }
}
