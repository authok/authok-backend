import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import * as Joi from 'joi';
import { ApiPropertyOptional } from "@nestjs/swagger";

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UserPageQueryDto extends PageQueryDto {
  @JoiSchema(Joi.string())
  @ApiPropertyOptional()
  connection?: string;

  @JoiSchema(Joi.alternatives(Joi.string().allow(''), Joi.array().items(Joi.string())))
  @ApiPropertyOptional()
  exclude_role_id: string | string[];

  @JoiSchema(Joi.alternatives(Joi.string().allow(''), Joi.array().items(Joi.string())))
  @ApiPropertyOptional()
  group: string | string[];

  @JoiSchema(Joi.string().allow(''))
  @ApiPropertyOptional()
  nickname: string;

  @JoiSchema(Joi.string().allow(''))
  @ApiPropertyOptional()
  email: string;

  @JoiSchema(Joi.string().allow(''))
  @ApiPropertyOptional()
  phone_number: string;
}