import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LogEventDto } from 'libs/api/logstream-api/src/log.dto';
import { ILogService } from 'libs/api/logstream-api/src/log.service';

@Injectable()
export class LogEventHandler {
  constructor(
    @Inject('ILogService') private readonly logService: ILogService,
  ) {}

  @OnEvent('log.created')
  async handleCreatedLogEvent(event: LogEventDto) {
    Logger.debug('before log');
    this.logService.log({ tenant: event.tenant }, event);
    Logger.debug('after log');
  }
}
