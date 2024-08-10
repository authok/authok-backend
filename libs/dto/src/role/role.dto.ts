import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { CREATE, UPDATE } from 'nestjs-joi';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

@JoiSchemaOptions({})
export class RoleDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string())
  readonly name: string;

  @ApiProperty()
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string())
  readonly description: string;

  @ApiProperty()
  @JoiSchema(Joi.date())
  readonly created_at?: Date;
}

export class CreateRoleDto extends OmitType(RoleDto, [
  'id',
  'created_at'
]) {}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

@JoiSchemaOptions({})
export class RolePermissionAssignmentDto {
  @ApiProperty({})
  @JoiSchema(
    Joi.array().items(
      Joi.object({
        resource_server_identifier: Joi.string().required(),
        permission_name: Joi.string().required(),
      }),
    ),
  )
  permissions: {
    resource_server_identifier: string;
    permission_name: string;
  }[];
}

@JoiSchemaOptions({})
export class RolePageQueryDto extends PageQueryDto {
  @ApiProperty()
  @JoiSchema(Joi.string())
  user_id?: string;
}

@JoiSchemaOptions({})
export class RoleUsersDto {
  @ApiProperty({ description: 'User ID list' })
  @JoiSchema(Joi.array().items(Joi.string()).required())
  users: string[];
}

@JoiSchemaOptions({})
export class PostUserRoleDto {
  @ApiProperty({ description: 'Role ID list' })
  @JoiSchema(Joi.array().items(Joi.string()).required())
  roles: string[];
}
