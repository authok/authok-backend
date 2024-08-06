import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { JoiSchemaOptions, JoiSchema, CREATE, UPDATE } from 'nestjs-joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class ClientGrantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @JoiSchema([CREATE], Joi.string().required())
  client_id: string;

  @ApiProperty()
  @JoiSchema([CREATE], Joi.string().required())
  audience: string;

  @ApiProperty()
  @JoiSchema([CREATE, UPDATE], Joi.array().items(Joi.string()))
  scope: string[];
}

@JoiSchemaOptions({})
export class ClientGrantPageQueryDto extends PageQueryDto {
  @ApiProperty()
  audience: string;

  @ApiProperty()
  client_id: string;
}

@JoiSchemaOptions({})
export class PatchClientGrantDto {
  @JoiSchema(Joi.array().items(Joi.string()).required())
  scope: string[];
}
