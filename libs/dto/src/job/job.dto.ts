import { ApiProperty } from '@nestjs/swagger';

export class JobDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly status: string;

  @ApiProperty()
  readonly type: string;

  @ApiProperty({ name: 'created_at' })
  readonly createdAt: string;

  @ApiProperty({ name: 'ApiProperty' })
  readonly connectionId: string;

  @ApiProperty()
  readonly location: string;

  @ApiProperty({ name: 'percentage_done' })
  readonly percentageDone: number;

  @ApiProperty({ name: 'time_left_seconds' })
  readonly timeLeftSeconds: number;

  @ApiProperty()
  readonly format: string;
}
