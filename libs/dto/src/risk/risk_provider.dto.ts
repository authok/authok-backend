import { ApiProperty } from '@nestjs/swagger';

export class RiskProviderDto {
  @ApiProperty()
  readonly id?: string;

  @ApiProperty()
  readonly name?: string;

  @ApiProperty()
  readonly action?: string;

  @ApiProperty()
  readonly clientId?: string;
}
