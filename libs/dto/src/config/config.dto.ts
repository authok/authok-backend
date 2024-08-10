import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import * as Joi from 'joi';
import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { Exclude } from "class-transformer";

@JoiSchemaOptions({
  allowUnknown: false,
})
export class ConfigDto {
  @JoiSchema(Joi.string().allow('', null).optional())
  namespace?: string;

  @JoiSchema(Joi.string())
  name: string;

  @JoiSchema(Joi.boolean())
  enabled: boolean;

  @JoiSchema(Joi.object())
  value: Record<string, any>;

  updated_at: Date;

  created_at: Date;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class ConfigPageQueryDto extends PageQueryDto {
  @JoiSchema(Joi.boolean())
  global: boolean;

  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  name: string | string[];

  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())).required())
  namespace: string | string[];
}