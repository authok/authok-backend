import { Controller, Patch, Body, Inject, Param, Get, UseGuards } from "@nestjs/common";
import { TriggerBindingDto, TriggerBindingsUpdateRequest } from "libs/api/infra-api/src/action/trigger-binding/trigger-binding.dto";
import { ITriggerBindingService } from "libs/api/infra-api/src/action/trigger-binding/trigger-binding.service";
import { ReqCtx, IRequestContext } from "@libs/nest-core";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { ThrottlerGuard, Throttle } from "@nestjs/throttler";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { PageDto } from "libs/common/src/pagination/pagination.dto";

@Controller('/api/v1/actions/triggers')
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@Throttle(3, 1)
@ApiTags('触发器/动作 - 绑定')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class TriggerBindingController {
  constructor(
    @Inject('ITriggerBindingService')
    private readonly triggerBindingService: ITriggerBindingService,
  ) {}
  
  @ApiOperation({
    summary: '更新触发器',
    description: '更新触发器',
  })
  @ApiOkResponse({
    type: TriggerBindingDto,
  })
  @Patch(':trigger_id/bindings')
  @Scopes('update:actions')
  async update(
    @ReqCtx() ctx: IRequestContext,
    @Param('trigger_id') trigger_id: string,
    @Body() body: TriggerBindingsUpdateRequest,
  ): Promise<TriggerBindingDto[]> {
    return await this.triggerBindingService.update(ctx, trigger_id, body.bindings);
  }

  @Get(':trigger_id/bindings')
  @Scopes('read:actions')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Param('trigger_id') trigger_id: string,
  ): Promise<PageDto<TriggerBindingDto>> {
    return await this.triggerBindingService.paginate(ctx, {
      trigger_id,
      page_size: 1000,
      sort: 'index',
    });
  }
}