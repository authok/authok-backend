import { Controller, Query, Get, Inject, Body, Post, Param, Patch, Delete, UseGuards, NotFoundException } from "@nestjs/common";
import { ActionPageQueryDto, ActionDto, CreateActionDto, UpdateActionDto, ExecutionDto, DeployDraftVersionBody, TestActionBody } from "libs/dto/src";
import { PageDto, pageDtoFactory } from "libs/common/src/pagination";
import { IActionService } from "libs/api/infra-api/src";
import { plainToClass } from "class-transformer";
import { TriggerDto } from "libs/dto//src";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { ThrottlerGuard, Throttle } from "@nestjs/throttler";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiOkResponse, ApiParam } from "@nestjs/swagger";
import { ITriggerClient } from "libs/support/trigger-client/src/interface";

@Controller('/api/v2/actions')
@UseGuards(ThrottlerGuard)
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(AuthGuard('jwt'), ScopesGuard) // Scopes必须放在 AuthGuard之后
@ApiTags('动作')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class ActionController {
  constructor(
    @Inject('IActionService')
    private readonly actionService: IActionService,
    @Inject('ITriggerClient')
    private readonly triggerClient: ITriggerClient,
  ) {}

  @ApiOperation({
    description: '分页获取动作',
    summary: '分页获取动作',
  })
  @ApiOkResponse({ type: pageDtoFactory(ActionDto) })
  @Get()
  @Scopes('read:actions')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: ActionPageQueryDto,
  ): Promise<PageDto<ActionDto>> {
    return await this.actionService.paginate(ctx, query);
  }

  @ApiOperation({
    description: '创建动作',
    summary: '创建动作',
  })
  @ApiOkResponse({ type: ActionDto })
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

  @ApiOperation({
    description: '获取动作',
    summary: '获取动作',
  })
  @ApiOkResponse({ type: ActionDto })
  @Get(':id')
  @Scopes('read:actions')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<ActionDto> {
    return await this.actionService.retrieve(ctx, id);
  }

  @ApiOperation({
    description: '更新动作',
    summary: '更新动作',
  })
  @ApiOkResponse({ type: ActionDto })
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

  @ApiOperation({
    description: '删除动作',
    summary: '删除动作',
  })
  @Delete(':id')
  @Scopes('delete:actions')
  async delete(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<void> {
    return await this.actionService.delete(ctx, id);
  }

  @Get('status')
  @ApiOperation({
    summary: '获取当前动作的状态.',
  })
  status() {
    return { status: 'ok' };
  }

  @Get('executions/:id')
  @ApiOperation({
    summary:
      '获取一个执行细节(执行日志最多保留7天).',
  })
  async executions(): Promise<ExecutionDto | undefined> {
    return null;
  }

  @Get(':action_id/versions')
  @ApiOperation({
    summary:
      "获取动作的所有版本.",
  })
  async versions(
    @Param('actionId') action_id: string,
  ): Promise<PageDto<ActionDto>> {
    return null;
  }

  @ApiOperation({ summary: '部署给定的动作' })
  @Post(':id/deploy')
  async deploy(@Param('id') id: string): Promise<ActionDto | undefined> {
    return null;
  }

  @Post(':actionId/versions/:id/deploy')
  @ApiParam({ name: 'action_id', description: '动作ID.' })
  @ApiParam({ name: 'id', description: '动作版本的ID.' })
  async deployDraftVersion(
    @Param('action_id') action_id: string,
    @Param('id') id: string,
    @Body() body: DeployDraftVersionBody,
  ): Promise<ActionDto | undefined> {
    // TODO
    return null;
  }

  @Post(':id/test')
  async test(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
    @Body() body: TestActionBody,
  ) {
    const event = body.payload;

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
}