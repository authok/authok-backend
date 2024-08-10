import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { LogEventDto } from './log.dto';
import { IContext } from '@libs/nest-core';
import { CursorResult, CursorQueryDto } from 'libs/common/src/pagination/cursor/cursor.dto';

export interface ILogService {
  search(ctx: IContext, query: PageQueryDto): Promise<PageDto<LogEventDto>>;

  log(ctx: IContext, input: Partial<LogEventDto>);

  retrieve(ctx: IContext, id: string): Promise<LogEventDto | undefined>;

  cursor(ctx: IContext, query: CursorQueryDto): Promise<CursorResult<LogEventDto>>;
}
