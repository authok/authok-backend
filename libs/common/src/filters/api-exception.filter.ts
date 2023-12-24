import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { APIException } from '../exception/api.exception';
import { ApiError } from './api-error.dto';

@Catch(APIException)
export class APIExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: APIException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    const r: ApiError = {
      statusCode: exception.getStatus(),
      error: exception.error,
      error_description: exception.message,
    };

    if (this.configService.get('ENV') === 'DEV') {
      r.stack = (exception as any).stack;
    }

    Logger.error('错误信息', JSON.stringify(r), 'APIExceptionFilter');

    response.status(exception.getStatus()).json(r);
  }
}
