import { UserDto } from "../user/user.dto";
import { JoiSchemaOptions, JoiSchema, CREATE, UPDATE } from "nestjs-joi";
import { ApiProperty } from "@nestjs/swagger";
import * as Joi from 'joi';
import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { Exclude } from "class-transformer";

@JoiSchemaOptions({
  allowUnknown: false,
})
export class InvitationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @JoiSchema(Joi.string())
  invitation_url: string;

  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string())
  client_id: string;

  @JoiSchema(Joi.object({
    email: Joi.string(),
    user_id: Joi.string(),
    phone_number: Joi.string(),
    username: Joi.string(),
    name: Joi.string(),
  }))
  inviter: Partial<UserDto>;

  @JoiSchema([CREATE], Joi.object({
    email: Joi.string(),
    id: Joi.string(),
    phone_number: Joi.string(),
    username: Joi.string(),
    name: Joi.string(),
  }).required())
  @JoiSchema([UPDATE], Joi.object({
    email: Joi.string(),
    id: Joi.string(),
    phone_number: Joi.string(),
    username: Joi.string(),
    name: Joi.string(),
  }))
  invitee: Record<string, any>;

  @JoiSchema([CREATE], Joi.string())
  connection: string;

  @JoiSchema(Joi.string())
  ticket: string;

  @JoiSchema(Joi.array().items(Joi.string()))
  roles: string[];

  org_id: string;

  created_at: Date;

  expires_at: Date;

  @Exclude()
  tenant?: string;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class InvitationPageQueryDto extends PageQueryDto {

}
