import * as Joi from 'joi';
import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import { PartialType, OmitType } from '@nestjs/swagger';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class EnrollmentDto {
  id: string;
  status: string;
  name: string;
  identifier: string;
  phone_number: string;
  enrolled_at: Date;
  last_auth: Date;
}

export class UpdateEnrollmentDto extends PartialType(OmitType(EnrollmentDto, [
  'id',
])) {};