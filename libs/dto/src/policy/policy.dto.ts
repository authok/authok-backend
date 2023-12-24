import { ApiProperty, OmitType } from '@nestjs/swagger';

export class ConditionDto {
  @ApiProperty()
  readonly activate?: string;

  @ApiProperty()
  readonly deactivate?: string;

  @ApiProperty()
  readonly rules?: string;
}

/**
 * Ref: https://developer.okta.com/docs/reference/api/policy
 *
 */
export class PolicyDto {
  @ApiProperty()
  readonly id?: string;

  // 登录/MFA/密码/授权/(Profile Enrollment) 策略
  @ApiProperty({ description: '' })
  readonly type?: string;

  // ACTIVE 或 INACTIVE
  @ApiProperty()
  readonly status?: string;

  @ApiProperty()
  readonly name?: string;

  @ApiProperty()
  readonly system?: boolean;

  @ApiProperty()
  readonly description?: string;

  @ApiProperty()
  readonly priority?: number;

  @ApiProperty()
  readonly conditions: ConditionDto;

  @ApiProperty()
  readonly settings: any;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}

export class UpdatePoliciesDto extends OmitType(PolicyDto, []) {}
