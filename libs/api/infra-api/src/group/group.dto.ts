import * as Joi from 'joi';
import { JoiSchemaOptions, JoiSchema, CREATE } from 'nestjs-joi';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class GroupDto {
  // GUID
  @JoiSchema([CREATE], Joi.string())
  id: string;

  // tenant unique group id
  @JoiSchema([CREATE], Joi.string())
  group_id: string;

  @JoiSchema([CREATE], Joi.string().default('authok'))
  type: string;

  @JoiSchema(Joi.string())
  @JoiSchema([CREATE], Joi.string().required())
  name: string;

  @JoiSchema(Joi.string())
  description: string;

  @JoiSchema(Joi.number())
  order: number;

  @JoiSchema(Joi.date())
  created_at: Date;

  @JoiSchema(Joi.date())
  updated_at: Date;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class GroupPageQueryDto extends PageQueryDto {
  @JoiSchema(Joi.string())
  type: string;

  @JoiSchema(Joi.string())
  parent_id: string;
}