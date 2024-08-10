import { Controller, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ILogService } from 'libs/api/logstream-api/src/log.service';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('/api/v2/logs')
@ApiTags('日志')
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
export class LogController {
  constructor(
    @Inject('ILogService')
    private readonly logService: ILogService,
  ) {}
}
