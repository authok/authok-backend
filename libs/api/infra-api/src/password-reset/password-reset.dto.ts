import { ApiProperty, PickType } from '@nestjs/swagger';

export class PasswordResetDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  initializer_ip: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  expires_at: Date;
}

export class UpdatePasswordResetDto extends PickType(PasswordResetDto, [
  'user_id',
  'initializer_ip',
  'token',
  'expires_at',
]) {}
