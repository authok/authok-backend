import { ApiProperty, PickType } from '@nestjs/swagger';

export class PasswordResetModel {
  user_id: string;
  initializer_ip: string;
  token: string;
  created_at: Date;
  expires_at: Date;
}

export class UpdatePasswordResetModel extends PickType(PasswordResetModel, [
  'user_id',
  'initializer_ip',
  'token',
  'expires_at',
]) {}
