import { Controller, Inject, Get, Req, Query, Param, UseGuards } from "@nestjs/common";
import { ITriggerService } from "libs/api/infra-api/src";
import { PageDto, pageDtoFactory } from "libs/common/src/pagination";
import { TriggerDto, TriggerQueryDto } from "libs/dto/src";
import { IRequestContext, ReqCtx } from "@libs/nest-core";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth, ApiTags, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";

@Controller('/api/v2/triggers')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiTags('触发器')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class TriggerController {
  constructor(
    @Inject('ITriggerService')
    private readonly triggerService: ITriggerService,
  ) {}

  @ApiOperation({
    summary: '分页查找触发器',
    description: '分页查找',
  })
  @ApiOkResponse({
    type: pageDtoFactory(TriggerDto)
  })
  @Get()
  @Scopes('read:triggers')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: TriggerQueryDto,
  ): Promise<PageDto<TriggerDto>> {
    return await this.triggerService.paginate(ctx, query);
  }

  @ApiOperation({
    summary: '根据id获取触发器',
    description: '根据id获取触发器',
  })
  @ApiOkResponse({
    type: TriggerDto
  })
  @Get(':id')
  @Scopes('read:triggers')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<TriggerDto | undefined> {
    return await this.triggerService.retrieve(ctx, id);
  }
}