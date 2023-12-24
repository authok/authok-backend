import { RoleDto } from "../role/role.dto";
import { OrganizationMemberDto } from "./organization-member.dto";
import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { JoiSchemaOptions, JoiSchema } from "nestjs-joi";
import * as Joi from 'joi';

export class OrganizationMemberRoleDto {
  member_id: string;
  member: OrganizationMemberDto;
  role: Partial<RoleDto>;

  created_at: Date;
  updated_at: Date;
}

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