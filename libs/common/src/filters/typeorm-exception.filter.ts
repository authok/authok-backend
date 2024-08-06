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
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any)?.message ?? 'something wrong';

    switch (exception.constructor) {
      case QueryFailedError: {
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        break;
      }
    }

    const r: ApiError = {
      statusCode: status,
      error: status.toString(),
      error_description: message,
    };

    if (this.configService.get('ENV') === 'DEV') {
      r.stack = (exception as any).stack;
    }

    Logger.error('错误信息', JSON.stringify(r), 'TypeORMExceptionFilter');

    response.status(status).json(r);
  }
}
