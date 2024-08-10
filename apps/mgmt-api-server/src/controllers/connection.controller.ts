import {
  Controller,
  Get,
  Post,
  Req,
  Inject,
  Query,
  Body,
  Param,
  NotFoundException,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PageDto } from 'libs/common/src/pagination';
import { IConnectionService } from 'libs/api/infra-api/src';
import {
  ConnectionPageQueryDto,
  CreateConnectionDto,
  UpdateConnectionDto,
  ConnectionDto,
} from 'libs/dto/src';
import { TenantGuard } from '../middleware/tenant.guard';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';

@Controller('/api/v2/connections')
@UseGuards(TenantGuard)
@UseGuards(ScopesGuard)
export class ConnectionController {
  constructor(
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
  ) {}

  @Get()
  @Scopes('read:connections')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: ConnectionPageQueryDto,
  ): Promise<PageDto<ConnectionDto>> {
    return await this.connectionService.paginate(ctx, query);
  }

  @Get(':id')
  @Scopes('read:connections')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ConnectionDto | undefined> {
    const connection = await this.connectionService.retrieve(ctx, id);
    if (!connection) throw new NotFoundException();

    return connection;
  }

  @Post()
  @Scopes('create:connections')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() connection: CreateConnectionDto,
  ) {
    return await this.connectionService.create(ctx, connection);
  }

  @Patch(':id')
  @Scopes('update:connections')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id,
    @Body() data: UpdateConnectionDto,
  ) {
    return await this.connectionService.update(ctx, id, data);
  }

  @Delete(':id')
  @Scopes('delete:connections')
  async delete(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<void> {
    await this.connectionService.delete(ctx, id);
  }
}
