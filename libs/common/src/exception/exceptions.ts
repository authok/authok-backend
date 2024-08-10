import { APIException } from './api.exception';
import { HttpStatus } from '@nestjs/common';

export class WrongUsernameOrPasswordError extends APIException {
  private usernameOrId: string;

  constructor(usernameOrId: string, message?: string) {
    super('invalid_user_password', message, HttpStatus.BAD_REQUEST);
    this.usernameOrId = usernameOrId;
  }
}
