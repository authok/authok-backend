import { Controller, Get, Post, Req, Inject, Query, Body, Param, Patch, UseGuards } from "@nestjs/common";
import { PageDto } from "libs/common/src/pagination";
import { IGroupService } from "libs/api/infra-api/src";
import { TenantGuard } from "../middleware/tenant.guard";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { ReqCtx, IRequestContext } from "@libs/nest-core";
import { GroupPageQueryDto, GroupDto } from "libs/dto/src";

@Controller('/api/v2/groups')
@UseGuards(TenantGuard)
@UseGuards(ScopesGuard)
export class GroupController {
  constructor(
    @Inject('IGroupService') private readonly groupService: IGroupService,
  ) {}

  @Get()
  @Scopes('read:groups')
  async paginate(@ReqCtx() ctx: IRequestContext, @Query() query: GroupPageQueryDto): Promise<PageDto<GroupDto>> {
    return await this.groupService.paginate(ctx, query);
  }

  @Get(':id')
  @Scopes('read:groups')
  async retrieve(@ReqCtx() ctx: IRequestContext, @Param('id') id: string): Promise<GroupDto | undefined> {
    return await this.groupService.retrieve(ctx, id);
  }

  @Post()
  @Scopes('create:groups')
  async create(@ReqCtx() ctx: IRequestContext, @Body() group: Partial<GroupDto>) {
    return await this.groupService.create(ctx, group);
  }

  @Patch(':id')
  @Scopes('update:groups')
  async update(@ReqCtx() ctx: IRequestContext, @Param('id') id, @Body() data: Partial<GroupDto>) {
    return await this.groupService.update(ctx, { id, ...data });
  }
}