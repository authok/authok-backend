import { ILogService } from 'libs/api/logstream-api/src/log.service';
import { Injectable } from '@nestjs/common';
import { LogEventDto } from 'libs/api/logstream-api/src/log.dto';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { IContext } from '@libs/nest-core';
import { cursor } from 'libs/common/src/pagination/cursor/typeorm-cursor';
import { CursorQueryDto, CursorResult } from 'libs/common/src/pagination/cursor/cursor.dto';

@Injectable()
export class LogService implements ILogService {
  constructor(
  ) {}

  async search(ctx: IContext, query: PageQueryDto): Promise<PageDto<LogEventDto>> {
    return undefined;
  }

  async retrieve(ctx: IContext, id: string): Promise<LogEventDto | undefined> {
    return undefined;
  }

  async log(ctx: IContext, input: Partial<LogEventDto>) {
    return undefined;
  }

  async cursor(ctx: IContext, query: CursorQueryDto): Promise<CursorResult<LogEventDto>> {
    return undefined;  
  }
}
