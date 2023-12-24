import { ILogService } from 'libs/api/logstream-api/src/log.service';
import { Injectable } from '@nestjs/common';
import { LogEventDto } from 'libs/api/logstream-api/src/log.dto';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { IRequestContext } from '@libs/nest-core';
import { CursorResult, CursorQueryDto } from 'libs/common/src/pagination/cursor/cursor.dto';

@Injectable()
export class CloudNativeLogService implements ILogService {
  async search(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<LogEventDto>> {
    // TODO
    return null;
  }

  async log(ctx: IRequestContext, input: Partial<LogEventDto>) {
    console.log('log', input);
  }

  async retrieve(ctx: IRequestContext, id: string): Promise<LogEventDto | undefined> {
    return null;
  }

  async cursor(ctx: IRequestContext, query: CursorQueryDto): Promise<CursorResult<LogEventDto>> {
    return {
      data: [],
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
}
