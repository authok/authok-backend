import { ApiProperty } from '@nestjs/swagger';

export class RuleDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly enabled: boolean;

  @ApiProperty()
  readonly script: string;

  @ApiProperty()
  readonly order: number;

  @ApiProperty()
  readonly stage: string;
}

export class CreateRuleDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly enabled: boolean;

  @ApiProperty()
  readonly script: string;

  @ApiProperty()
  readonly order: number;
}

export class UpdateRuleDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly enabled: boolean;

  @ApiProperty()
  readonly script: string;

  @ApiProperty()
  readonly order: number;
}
