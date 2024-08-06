import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import * as Joi from 'joi';
import { ApiProperty } from "@nestjs/swagger";


@JoiSchemaOptions({
  allowUnknown: false,
})
export class OrganizationMemberRolePageQueryDto extends PageQueryDto {
  member_id: string;
  role_id: string;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class OrganizationMemberAddRolesDto {
  @ApiProperty()
  @JoiSchema(Joi.array().items(Joi.string()))
  roles: string[];  
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class OrganizationMemberRemoveRolesDto {
  @JoiSchema(Joi.array().items(Joi.string()))
  roles: string[];
}