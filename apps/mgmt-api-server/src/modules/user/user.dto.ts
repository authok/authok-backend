import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import * as Joi from 'joi';
import { ConnectionDto as _ConnectionDto} from 'libs/api/infra-api/src/connection/connection.dto';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UserPageQueryDto extends PageQueryDto {
  @JoiSchema(Joi.string())
  connection?: string;

  @JoiSchema(Joi.alternatives(Joi.string().allow(''), Joi.array().items(Joi.string())))
  exclude_role_id: string | string[];

  @JoiSchema(Joi.alternatives(Joi.string().allow(''), Joi.array().items(Joi.string())))
  group: string | string[];

  @JoiSchema(Joi.string().allow(''))
  nickname: string;

  @JoiSchema(Joi.string().allow(''))
  email: string;

  @JoiSchema(Joi.string().allow(''))
  phone_number: string;
}