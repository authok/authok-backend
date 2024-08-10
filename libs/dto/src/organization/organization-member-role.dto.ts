import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import * as Joi from 'joi';
import { ApiProperty } from "@nestjs/swagger";
import { OrganizationMemberDto } from "./organization-member.dto";
import { UserDto } from "../user";


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
export class OrganizationMemberRoleDto {
  @ApiProperty()
  member_id: string;

  @ApiProperty()
  member: OrganizationMemberDto;

  @ApiProperty()
  role: OrganizationMemberRoleDto;

  @ApiProperty()
  user?: UserDto;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
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