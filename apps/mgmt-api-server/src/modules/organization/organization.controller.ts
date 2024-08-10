import { Controller, Get, Post, Inject, Query, Body, Param, NotFoundException, Patch, Delete, UseGuards } from "@nestjs/common";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { IOrganizationService } from "libs/api/infra-api/src";
import { 
  CreateOrganizationDto, 
  OrganizationPageQueryDto, 
  OrganizationDto, 
  UpdateOrganizationDto, 
  OrganizationEnabledConnectionDto, 
  AddOrganizationEnabledConnectionDto, 
  UpdateOrganizationEnabledConnectionDto,
} from "libs/dto/src";
import { ReqCtx, IRequestContext } from "@libs/nest-core";

@Controller('/api/v2/organizations')
@UseGuards(ScopesGuard)
export class OrganizationController {
  constructor(
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
  ) {}

  @Get(':org_id/enabled_connections')
  @Scopes('read:organizations')
  async enabledConnections(@ReqCtx() ctx: IRequestContext, @Param('org_id') org_id: string): Promise<PageDto<OrganizationEnabledConnectionDto>> {
    return await this.organizationService.enabledConnections(ctx, org_id);
  }

  @Post(':org_id/enabled_connections')
  @Scopes('read:organizations')
  async addConnection(
    @ReqCtx() ctx: IRequestContext, 
    @Param('org_id') org_id: string,
    @Body() connection: AddOrganizationEnabledConnectionDto,
  ): Promise<OrganizationEnabledConnectionDto> {
    return await this.organizationService.addConnection(ctx, org_id, connection);
  }

  @Delete(':org_id/enabled_connections/:connection_id')
  @Scopes('delete:organizations')
  async deleteConnection(
    @ReqCtx() ctx: IRequestContext, 
    @Param('org_id') org_id: string,
    @Param('connection_id') connection_id: string,
  ): Promise<void> {
    return await this.organizationService.deleteConnection(ctx, org_id, connection_id);
  }

  @Patch(':org_id/enabled_connections/:connection_id')
  @Scopes('update:organizations')
  async updateConnection(
    @ReqCtx() ctx: IRequestContext, 
    @Param('org_id') org_id: string,
    @Param('connection_id') connection_id: string,
    @Body() data: UpdateOrganizationEnabledConnectionDto,
  ): Promise<OrganizationEnabledConnectionDto> {
    return await this.organizationService.updateConnection(ctx, org_id, connection_id, data);
  }

  @Get()
  @Scopes('read:organizations')
  async paginate(@ReqCtx() ctx: IRequestContext, @Query() query: OrganizationPageQueryDto): Promise<PageDto<OrganizationDto>> {
    return await this.organizationService.paginate(ctx, query);
  }

  @Post()
  @Scopes('create:organizations')
  async create(@ReqCtx() ctx: IRequestContext, @Body() organization: CreateOrganizationDto): Promise<OrganizationDto> {
    return await this.organizationService.create(ctx, organization);
  }

  @Get(':id')
  @Scopes('read:organizations')
  async retrieve(@ReqCtx() ctx: IRequestContext, @Param('id') id: string): Promise<OrganizationDto | undefined> {
    const client = await this.organizationService.retrieve(ctx, id);
    if (!client) throw new NotFoundException();

    return client;
  }

  @Patch(':id')
  @Scopes('update:organizations')
  async update(@ReqCtx() ctx: IRequestContext, @Param('id') id: string, @Body() data: UpdateOrganizationDto) {
    return await this.organizationService.update(ctx, id, data);
  }

  @Delete(':id')
  @Scopes('delete:organizations')
  async delete(@ReqCtx() ctx: IRequestContext, @Param('id') id: string): Promise<void> {
    await this.organizationService.delete(ctx, id);
  }
}