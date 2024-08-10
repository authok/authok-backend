import {
  Controller,
  Patch,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Inject,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiParam,
} from '@nestjs/swagger';
import {
  ClientDto,
  CreateClientDto,
  UpdateClientDto,
  ClientPageQueryDto,
} from 'libs/dto/src';
import { IClientService } from 'libs/api/infra-api/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { AuthGuard } from '@nestjs/passport';
import {
  PageDto,
  pageDtoFactory,
} from 'libs/common/src/pagination/pagination.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';

@Controller('/api/v2/clients')
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
export class ClientController {
  constructor(
    @Inject('IClientService')
    private readonly clientService: IClientService,
  ) {}

  @Get()
  @ApiOperation({ summary: '获取应用列表', description: '获取应用列表' })
  @ApiOkResponse({ type: pageDtoFactory(ClientDto) })
  @Scopes('read:clients')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: ClientPageQueryDto,
  ): Promise<PageDto<ClientDto>> {
    return await this.clientService.paginate(ctx, query);
  }

  @Post()
  @ApiOperation({ summary: '创建应用' })
  @Scopes('create:clients')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() client: CreateClientDto,
  ): Promise<ClientDto | undefined> {
    return await this.clientService.create(ctx, client);
  }

  @Get(':id')
  @ApiOperation({ summary: '查找应用', description: '根据ID查找应用' })
  @ApiOkResponse({
    type: ClientDto,
  })
  @Scopes('read:clients')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ClientDto | undefined> {
    const client = await this.clientService.retrieve(ctx, id);
    if (!client) throw new NotFoundException();
    return client;
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除应用', description: '删除应用' })
  @Scopes('delete:clients')
  async delete(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<void> {
    return await this.clientService.delete(ctx, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新应用', description: '更新应用' })
  @ApiOkResponse({ type: ClientDto })
  @Scopes('update:clients')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() body: UpdateClientDto,
  ): Promise<ClientDto | undefined> {
    return this.clientService.update(ctx, id, body);
  }

  @Post(':id/rotate-secret')
  @ApiOperation({ summary: '轮换秘钥', description: '轮换秘钥' })
  @ApiParam({ name: 'id', description: '应用ID' })
  @Scopes('update:clients')
  async rotateSecret(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ClientDto | undefined> {
    return await this.clientService.rotate(ctx, id);
  }
}
