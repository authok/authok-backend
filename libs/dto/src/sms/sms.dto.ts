import { ApiProperty } from '@nestjs/swagger';

export class SmsDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly createdAt?: Date;

  @ApiProperty()
  readonly updatedAt?: Date;
}

export class CreateSmsDto {}

export class UpdateSmsDto {
  @ApiProperty()
  readonly id: string;
}
