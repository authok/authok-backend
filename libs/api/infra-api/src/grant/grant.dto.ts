import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { ApiProperty } from "@nestjs/swagger";
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false
})
export class GrantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  client_id: string;

  @ApiProperty()
  resources: Record<string, any>;

  openid: any;

  rejected: any;

  data: any;

  iat: number;

  exp: number;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  created_at: Date;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class GrantPageQueryDto extends PageQueryDto {
  @ApiProperty({ required: false })
  @JoiSchema(Joi.string())
  user_id?: string;

  @ApiProperty({ required: false })
  @JoiSchema(Joi.string())
  client_id?: string;

  @ApiProperty({ required: false })
  @JoiSchema(Joi.string())
  audience?: string;
}