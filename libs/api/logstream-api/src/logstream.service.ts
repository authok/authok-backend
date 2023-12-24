import { IRequestContext } from '@libs/nest-core';
import {
  LogStreamDto,
  CreateLogStreamDto,
  UpdateLogStreamDto,
} from './logstream.dto';

export interface ILogStreamService {
  paginate(ctx: IRequestContext): Promise<LogStreamDto[]>;

  retrieve(ctx: IRequestContext, id: string): Promise<LogStreamDto>;

  create(
    ctx: IRequestContext,
    logStream: CreateLogStreamDto,
  ): Promise<LogStreamDto>;

  delete(ctx: IRequestContext, id: string);

  update(
    ctx: IRequestContext,
    id: string,
    data: UpdateLogStreamDto,
  ): Promise<LogStreamDto>;
}
