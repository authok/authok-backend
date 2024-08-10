import { Controller, Get, Post, Req, Inject, Query, Body, Param, NotFoundException, Patch, Delete, Logger, UseGuards } from "@nestjs/common";
import { ILogService } from "libs/api/logstream-api/src/log.service";
import { LogEventDto, LogCursorQueryDto } from "libs/api/logstream-api/src/log.dto";
import { CursorResult } from "libs/common/src/pagination/cursor/cursor.dto";
import { TenantGuard } from "../middleware/tenant.guard";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { IRequestContext, ReqCtx } from "@libs/nest-core";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";

@Controller('/api/v2/logs')
@UseGuards(ScopesGuard)
@UseGuards(TenantGuard)
export class LogController {
  constructor(
    @Inject('ILogService') private readonly logService: ILogService,
  ) {}

  @Get()
  @Scopes('read:logs')
  async cursor(@ReqCtx() ctx: IRequestContext, @Query() query: LogCursorQueryDto): Promise<CursorResult<LogEventDto>> {
    return this.logService.cursor(ctx, query);
  }
}