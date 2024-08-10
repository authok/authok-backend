import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SmsTemplateDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty({ name: 'enrollment_message' })
  readonly enrollmentMessage: string;

  @ApiProperty({ name: 'verification_message' })
  readonly verificationMessage: string;

  @ApiProperty()
  readonly createdAt?: Date;

  @ApiProperty()
  readonly updatedAt?: Date;
}

export class CreateSmsTemplateDto extends OmitType(SmsTemplateDto, [
  'createdAt',
  'updatedAt',
]) {}

export class UpdateSmsTemplateDto extends OmitType(SmsTemplateDto, [
  'createdAt',
  'updatedAt',
]) {
  @ApiProperty()
  readonly id: string;
}
