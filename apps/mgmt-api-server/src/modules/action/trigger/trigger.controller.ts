import { Controller, Inject, Get, Req, Query, Param, UseGuards } from "@nestjs/common";
import { ITriggerService } from "libs/api/infra-api/src";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { TriggerDto, TriggerQueryDto } from "libs/dto/src";
import { TenantGuard } from "apps/mgmt-api-server/src/middleware/tenant.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";

@Controller('/api/v2/triggers')
@UseGuards(TenantGuard)
export class TriggerController {
  constructor(
    @Inject('ITriggerService')
    private readonly triggerService: ITriggerService,
  ) {}

  @Get()
  @Scopes('read:triggers')
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: TriggerQueryDto,
  ): Promise<PageDto<TriggerDto>> {
    return await this.triggerService.paginate(ctx, query);
  }

  @Get(':id')
  @Scopes('read:triggers')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('id') id: string,
  ): Promise<TriggerDto | undefined> {
    return await this.triggerService.retrieve(ctx, id);
  }
}