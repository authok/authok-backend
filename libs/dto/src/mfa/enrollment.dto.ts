import { ApiProperty } from '@nestjs/swagger';

export class EnrollmentDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly status: string;

  @ApiProperty()
  readonly type: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly identifier: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly auth_method: string;

  @ApiProperty()
  readonly enrolled_at: string;

  @ApiProperty()
  readonly last_auth: string;
}