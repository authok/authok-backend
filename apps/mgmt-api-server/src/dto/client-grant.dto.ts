import * as Joi from 'joi';
import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class ClientGrantPageQueryDto extends PageQueryDto {
  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  audience?: string | string[];

  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  client_id?: string | string[];
}