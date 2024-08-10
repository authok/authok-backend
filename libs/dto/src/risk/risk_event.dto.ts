import { ApiProperty } from '@nestjs/swagger';

export class RiskEventDto {
  @ApiProperty()
  readonly timestamp?: string;

  @ApiProperty()
  readonly expiresAt?: string;

  @ApiProperty()
  readonly subjects?: RiskSubject[];
}

export class RiskSubject {
  @ApiProperty()
  readonly ip?: string;

  @ApiProperty()
  readonly riskLevel?: string;

  @ApiProperty()
  readonly message?: string;
}
