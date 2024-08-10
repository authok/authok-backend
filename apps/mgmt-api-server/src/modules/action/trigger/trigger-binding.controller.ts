import { Controller, Patch, Body, Inject, Param, Get, UseGuards } from "@nestjs/common";
import { TriggerBindingDto, TriggerBindingsUpdateRequest } from "libs/dto/src";
import { ITriggerBindingService } from "libs/api/infra-api/src";
import { TenantGuard } from "apps/mgmt-api-server/src/middleware/tenant.guard";
import { ReqCtx, IRequestContext } from "@libs/nest-core";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { PageDto } from "libs/common/src/pagination";

@Controller('/api/v2/actions/triggers')
@UseGuards(TenantGuard)
@UseGuards(ScopesGuard)
export class TriggerBindingController {
  constructor(
    @Inject('ITriggerBindingService')
    private readonly triggerBindingService: ITriggerBindingService,
  ) {}
  
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
      per_page: 1000,
      sort: 'index',
    });
  }
}