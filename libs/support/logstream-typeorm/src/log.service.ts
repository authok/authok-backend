import { ILogService } from 'libs/api/logstream-api/src/log.service';
import { Injectable } from '@nestjs/common';
import { LogEvent } from './log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEventDto } from 'libs/api/logstream-api/src/log.dto';
import { PageDto, PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { Repository } from 'typeorm';
import { IContext } from '@libs/nest-core';
import { cursor } from 'libs/common/src/pagination/cursor/typeorm-cursor';
import { CursorQueryDto, CursorResult } from 'libs/common/src/pagination/cursor/cursor.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LogService implements ILogService {
  constructor(
    @InjectRepository(LogEvent, 'logstream')
    private readonly logRepo: Repository<LogEvent>,
  ) {}

  async search(ctx: IContext, query: PageQueryDto): Promise<PageDto<LogEventDto>> {
    // TODO

    return null;
  }

  async retrieve(ctx: IContext, id: string): Promise<LogEventDto | undefined> {
    return await this.logRepo.findOne({
      where: { id },
    });
  }

  async log(ctx: IContext, input: Partial<LogEventDto>) {
    const log = plainToClass(LogEvent, input);
    log.date = new Date();

    await this.logRepo.save(log);
  }

  async cursor(ctx: IContext, query: CursorQueryDto): Promise<CursorResult<LogEventDto>> {
    query.tenant = ctx.tenant;
    return await cursor<LogEvent>(this.logRepo, query, ['date', 'id'], ['date', 'user_id']);
  }
}
