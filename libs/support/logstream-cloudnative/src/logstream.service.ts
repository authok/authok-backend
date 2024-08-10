import { ILogStreamService } from 'libs/api/logstream-api/src/logstream.service';
import {
  LogStreamDto,
  CreateLogStreamDto,
  UpdateLogStreamDto,
} from 'libs/api/logstream-api/src/logstream.dto';
import { IRequestContext } from '@libs/nest-core';

export class CloudNativeLogStreamService implements ILogStreamService {
  async paginate(ctx: IRequestContext): Promise<LogStreamDto[]> {
    // TODO
    return null;
  }

  async retrieve(ctx: IRequestContext): Promise<LogStreamDto> {
    return null;
  }

  async create(
    ctx: IRequestContext,
    input: CreateLogStreamDto,
  ): Promise<LogStreamDto> {
    return null;
  }

  async delete(ctx: IRequestContext, id: string) {
    // TODO
  }

  async update(
    ctx: IRequestContext,
    id: string,
    input: UpdateLogStreamDto,
  ): Promise<LogStreamDto> {
    // TODO
    return null;
  }
}
