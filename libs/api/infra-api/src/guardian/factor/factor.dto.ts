import { ApiProperty } from '@nestjs/swagger';

/**
 * MFA(多因素认证)的因素
 */
export class FactorDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly factorType?: string;

  @ApiProperty()
  readonly provider?: string;

  @ApiProperty()
  readonly name?: string;

  @ApiProperty()
  readonly status?: string;

  @ApiProperty()
  readonly profile?: Record<string, any>;

  @ApiProperty()
  readonly createdAt?: Date;

  @ApiProperty()
  readonly updatedAt?: Date;
}

export class FactorConfigDto {
  name: string;
  enabled: boolean;
  value: any;
}

export class FactorProviderDto {
  name: string;
  title: string;
  schema: string;
}