import {
  Controller,
  Get,
  Post,
  Inject,
  Query,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PageDto } from 'libs/common/src/pagination';
import { IClientGrantService } from 'libs/api/infra-api/src';
import { ClientGrantPageQueryDto } from '../dto/client-grant.dto';
import { ClientGrantDto } from 'libs/dto/src';
import { TenantGuard } from '../middleware/tenant.guard';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';

@Controller('/api/v2/client-grants')
@UseGuards(TenantGuard)
@UseGuards(ScopesGuard)
export class ClientGrantController {
  constructor(
    @Inject('IClientGrantService')
    private readonly clientGrantService: IClientGrantService,
  ) {}

  @Get()
  @Scopes('read:client_grants')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: ClientGrantPageQueryDto,
  ): Promise<PageDto<ClientGrantDto>> {
    return await this.clientGrantService.paginate(ctx, query);
  }

  @Get(':id')
  @Scopes('read:client_grants')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ClientGrantDto | undefined> {
    return await this.clientGrantService.retrieve(ctx, id);
  }

  @Post()
  @Scopes('create:client_grants')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() clientGrant: ClientGrantDto,
  ) {
    return await this.clientGrantService.create(ctx, clientGrant);
  }

  @Patch(':id')
  @Scopes('update:client_grants')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id,
    @Body() data: ClientGrantDto,
  ) {
    return await this.clientGrantService.update(ctx, id, data);
  }

  @Delete(':id')
  @Scopes('delete:client_grants')
  async delete(@ReqCtx() ctx: IRequestContext, @Param('id') id): Promise<void> {
    return await this.clientGrantService.delete(ctx, id);
  }
}
