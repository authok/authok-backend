import { ApiProperty, OmitType } from "@nestjs/swagger";
import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import * as Joi from 'joi';
import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";

@JoiSchemaOptions({
  allowUnknown: false,
})
export class TriggerDto {
  @ApiProperty()
  id: string;

  @JoiSchema(Joi.string())
  display_name: string;

  @ApiProperty()
  @JoiSchema(Joi.string())
  version: string;

  @ApiProperty()
  @JoiSchema(Joi.array().items(Joi.string()))
  runtimes: string[];

  @ApiProperty()
  @JoiSchema(Joi.string())
  default_runtime: string;

  @ApiProperty()
  @JoiSchema(Joi.string())
  status: string;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UpdateTriggerDto extends OmitType(TriggerDto, ['id']) {}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class TriggerQueryDto extends PageQueryDto {
}