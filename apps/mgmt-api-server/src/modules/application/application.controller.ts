import { Controller, Get, Post, Inject, Query, Body, Param, NotFoundException, Patch, Delete, UseGuards } from "@nestjs/common";
import { PageDto } from "libs/common/src/pagination";
import { IClientService } from "libs/api/infra-api/src";
import { ClientDto, CreateClientDto, ClientPageQueryDto } from "libs/dto/src";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { TenantGuard } from "../../middleware/tenant.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";

@Controller('/api/v2/clients')
@UseGuards(ScopesGuard)
@UseGuards(TenantGuard)
export class ApplicationController {
  constructor(
    @Inject('IClientService')
    private readonly clientService: IClientService,
  ) {}

  @Get()
  @Scopes('read:clients')
  async paginate(@ReqCtx() ctx: IRequestContext, @Query() query: ClientPageQueryDto): Promise<PageDto<ClientDto>> {
    return await this.clientService.paginate(ctx, query);
  }

  @Post()
  @Scopes('create:clients')
  async create(@ReqCtx() ctx: IRequestContext, @Body() client: CreateClientDto): Promise<ClientDto> {
    const savedApp = await this.clientService.create(ctx, client);

    return savedApp;
  }

  @Get(':id')
  @Scopes('read:clients')
  async retrieve(@ReqCtx() ctx: IRequestContext, @Param('id') id: string): Promise<ClientDto | undefined> {
    const client = await this.clientService.retrieve(ctx, id);
    if (!client) throw new NotFoundException();

    return client;
  }

  @Patch(':id')
  @Scopes('update:clients')
  async update(@ReqCtx() ctx: IRequestContext, @Param('id') id: string, @Body() data: ClientDto) {
    return await this.clientService.update(ctx, id, data);
  }

  @Delete(':id')
  @Scopes('delete:clients')
  async delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string): Promise<void> {
    await this.clientService.delete(ctx, id);
  }
}