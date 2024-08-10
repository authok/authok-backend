import {
  Controller,
  Patch,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Delete,
  Inject,
  Query,
  Res,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  ConnectionDto,
  UpdateConnectionDto,
  CreateConnectionDto,
  ConnectionPageQueryDto,
} from 'libs/dto/src';
import { 
  IConnectionService,
  IUserService,
} from 'libs/api/infra-api/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import {
  PageDto,
  pageDtoFactory,
} from 'libs/common/src/pagination';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';

@Controller('/api/v2/connections')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiTags('身份源')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class ConnectionController {
  constructor(
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: '根据ID查找身份源',
    description: '根据ID查找身份源',
  })
  @ApiOkResponse({
    type: ConnectionDto,
  })
  @ApiParam({ name: 'id', description: '身份源ID' })
  @Scopes('read:connections')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ConnectionDto | undefined> {
    const connection = await this.connectionService.retrieve(ctx, id);
    if (!connection) throw new NotFoundException('connection not found');

    return {
      id: connection.id,
      name: connection.name,
      display_name: connection.display_name,
      strategy: connection.strategy,
      options: connection.options,
      enabled_clients: connection.enabled_clients,
      is_domain_connection: connection.is_domain_connection,
      metadata: connection.metadata,
      created_at: connection.created_at,
      updated_at: connection.updated_at,
    } as ConnectionDto;
  }

  @Post()
  @ApiOperation({ summary: '创建身份源', description: '创建身份源' })
  @ApiOkResponse({
    description: '身份源',
    type: ConnectionDto,
  })
  @Scopes('create:connections')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() input: CreateConnectionDto,
  ): Promise<ConnectionDto | null> {
    Logger.debug('创建连接, 当前租户: ' + ctx.tenant);

    // 这里要用登录用户的租户
    return this.connectionService.create(ctx, input);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新身份源' })
  @ApiOkResponse({
    description: '身份源',
    type: ConnectionDto,
  })
  @Scopes('update:connections')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() input: UpdateConnectionDto,
  ): Promise<ConnectionDto | null> {
    return await this.connectionService.update(ctx, id, input);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除一个身份源和所有属于该身份源的用户' })
  @Scopes('delete:connections')
  async delete(
    @Param('id') id: string,
    @ReqCtx() ctx: IRequestContext,
  ): Promise<void> {
    await this.connectionService.delete(ctx, id);
  }

  @Get()
  @ApiOperation({ summary: '获取身份源列表', description: '获取身份源列表' })
  @ApiOkResponse({ type: pageDtoFactory(ConnectionDto) })
  @Scopes('read:connections')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: ConnectionPageQueryDto,
  ): Promise<PageDto<ConnectionDto>> {
    const page = await this.connectionService.paginate(ctx, query);

    return {
      meta: page.meta,
      items: page.items.map(
        (connection) =>
          ({
            id: connection.id,
            name: connection.name,
            display_name: connection.display_name,
            strategy: connection.strategy,
            options: connection.options,
            enabled_clients: connection.enabled_clients,
            is_domain_connection: connection.is_domain_connection,
            metadata: connection.metadata,
          } as ConnectionDto),
      ),
    };
  }

  @Get(':id/status')
  @ApiOperation({ summary: '获取身份源的状态' })
  @ApiResponse({ status: 200, description: 'the connection is online' })
  @Scopes('read:connections')
  async status(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    res.sendStatus(200);
  }

  @Delete(':id/users')
  @ApiOperation({ summary: '删除给定身份源的给定用户' })
  @ApiQuery({
    name: 'phone_username',
    description: '如果指定, 删除指定用户名的用户',
  })
  @ApiQuery({
    name: 'phone_number',
    description: '如果指定, 删除指定手机号的用户',
  })
  @ApiQuery({ name: 'email', description: '如果指定, 删除指定邮箱的用户' })
  @Scopes('delete:users')
  async deleteUser(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Query('email') email: string,
    @Query('phone_number') phone_number: string,
    @Query('username') username: string,
  ): Promise<void> {
    const connection = await this.connectionService.retrieve(ctx, id);
    if (!connection) throw new NotFoundException();

    let user;
    if (username) {
      user = await this.userService.findByUsername(ctx, connection.name, user);
    } else if (phone_number) {
      user = await this.userService.findByPhoneNumber(
        ctx,
        connection.name,
        user,
      );
    } else if (email) {
      user = await this.userService.findByEmail(ctx, connection.name, user);
    }

    if (!user) throw new NotFoundException();

    await this.userService.delete(ctx, user.user_id);
  }
}
