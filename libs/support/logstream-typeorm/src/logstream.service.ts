import { ILogStreamService } from 'libs/api/logstream-api/src/logstream.service';
import {
  LogStreamDto,
  CreateLogStreamDto,
  UpdateLogStreamDto,
} from 'libs/api/logstream-api/src/logstream.dto';
import { IRequestContext } from '@libs/nest-core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogStream } from './logstream.entity';
@Injectable()
export class LogStreamService implements ILogStreamService {
  constructor(
    @InjectRepository(LogStream, 'logstream')
    private readonly repo: Repository<LogStream>,
  ) {}

  async paginate(ctx: IRequestContext): Promise<LogStreamDto[]> {
    // TODO
    return null;
  }

  async retrieve(ctx: IRequestContext, id: string): Promise<LogStreamDto> {
    return null;
  }

  async create(
    ctx: IRequestContext,
    logStream: CreateLogStreamDto,
  ): Promise<LogStreamDto> {
    return null;
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    // TODO
    return;
  }

  async update(
    ctx: IRequestContext,
    id: string,
    data: UpdateLogStreamDto,
  ): Promise<LogStreamDto> {
    // TODO
    return null;
  }
}
