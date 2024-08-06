import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import * as Joi from 'joi';

@JoiSchemaOptions({})
export class ScopeDto {
  value: string;
  description: string;
}

export class PermissionSourceDto {
  source_id: string;
  source_name: string;
  source_type: string;
}

export class PermissionDto {
  @ApiProperty({
    description: 'Resource server (API) identifier that this permission is for',
  })
  readonly resource_server_identifier: string;

  @ApiProperty({ description: 'Name of this permission' })
  readonly permission_name: string;

  @ApiProperty({
    description: 'Resource server (API) name this permission is for',
  })
  readonly resource_server_name?: string;

  @ApiProperty({})
  readonly description?: string;

  @ApiHideProperty()
  readonly sources?: PermissionSourceDto[];
}

@JoiSchemaOptions({})
export class PermissionPageQueryDto extends PageQueryDto {
  @ApiProperty({})
  @JoiSchema(Joi.string())
  role_id?: string;

  @ApiProperty({})
  @JoiSchema(Joi.string())
  user_id?: string;
}
