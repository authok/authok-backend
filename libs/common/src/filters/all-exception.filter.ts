import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ApiError } from './api-error.dto';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = (exception as any)?.message;

    const r: ApiError = {
      statusCode: status,
      error: status.toString(),
      error_description: message,
    };

    if (this.configService.get('ENV') === 'DEV') {
      r.stack = (exception as any).stack;
    }

    Logger.error('错误信息', JSON.stringify(r), 'AllExceptionFilter');

    response.status(status).json(r);
  }
}
