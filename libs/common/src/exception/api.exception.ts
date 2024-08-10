import { HttpException, HttpStatus } from '@nestjs/common';

export class APIException extends HttpException {
  public error: string;

  constructor(error: string, message?: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, status);
    this.error = error;
  }
}
