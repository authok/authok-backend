import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import * as Joi from 'joi';
import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { Node } from "libs/api/search-api/src/node/node";

@JoiSchemaOptions({
  allowUnknown: false,
})
export class NodeDto<T> {
  @JoiSchema(Joi.alternatives(Joi.string(), Joi.number()))
  id: string | number;

  @JoiSchema(Joi.string())
  type: string;

  @JoiSchema(Joi.string())
  name: string;

  @JoiSchema(Joi.array().items(Joi.string()))
  keywords: string[];

  @JoiSchema(Joi.string())
  parent_id: string;

  @JoiSchema(Joi.any())
  data?: T;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class NodePageQueryDto extends PageQueryDto {
  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  type: string | string[];

  @JoiSchema(Joi.alternatives(Joi.string(), Joi.number()))
  parent_id: string | number;
}