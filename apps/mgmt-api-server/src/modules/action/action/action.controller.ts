import { Controller, Req, Query, Get, Inject, Body, Post, Param, Patch, Delete, UseGuards, NotFoundException } from "@nestjs/common";
import { ActionPageQueryDto, ActionDto, CreateActionDto, UpdateActionDto } from "libs/dto/src";
import { PageDto } from "libs/common/src/pagination";
import { IActionService } from "libs/api/infra-api/src";
import { plainToClass } from "class-transformer";
import { TriggerDto } from "libs/dto/src";
import { TenantGuard } from "apps/mgmt-api-server/src/middleware/tenant.guard";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { TriggerEventDto } from "./action.dto";
import { ITriggerClient } from "libs/support/trigger-client/src/interface";

@Controller('/api/v2/actions')
@UseGuards(TenantGuard)
@UseGuards(ScopesGuard)
export class ActionController {
  constructor(
    @Inject('IActionService')
    private readonly actionService: IActionService,

    @Inject('ITriggerClient')
    private readonly triggerClient: ITriggerClient,
  ) {}

  @Post(':id/test')
  async test(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() event: TriggerEventDto,
  ) {
    const action = await this.actionService.retrieve(ctx, id);
    if (!action) throw new NotFoundException('action not found');

    const trigger = action.supported_triggers[0];
  
    const secrets = {};
    if (action.secrets) {
      for (const secret of action.secrets) {
        secrets[secret.name] = secret.value;
      }
    }
    console.log('secrets: ', secrets);

    event.code = action.code;
    event.secrets = secrets;
    // trigger to func
    return await this.triggerClient.run(trigger.id, null, event);
  }

  @Get()
  @Scopes('read:actions')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: ActionPageQueryDto,
  ): Promise<PageDto<ActionDto>> {
    return await this.actionService.paginate(ctx, query);
  }

  @Post()
  @Scopes('create:actions')
  async create(
    @ReqCtx() ctx: IRequestContext,
    @Body() data: CreateActionDto,
  ): Promise<ActionDto> {
    const { supported_triggers, ..._data } = data;
    const action = {
      supported_triggers: supported_triggers?.map(it => plainToClass(TriggerDto, {
        id: it,
      })),
      ..._data,
    } as ActionDto;

    return await this.actionService.create(ctx, action);
  }

  @Get(':id')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ActionDto> {
    return await this.actionService.retrieve(ctx, id);
  }

  @Patch(':id')
  @Scopes('update:actions')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() data: UpdateActionDto,
  ): Promise<ActionDto> {
    const { supported_triggers, ..._data } = data;
    const action = {
      id,
      supported_triggers: supported_triggers?.map(it => plainToClass(TriggerDto, {
        id: it,
      })),
      ..._data,
    } as ActionDto;

    return await this.actionService.update(ctx, action);
  }

  @Delete(':id')
  @Scopes('delete:actions')
  async delete(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<void> {
    return await this.actionService.delete(ctx, id);
  }
}