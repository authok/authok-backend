import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { BrandingDto } from '../branding/branding.dto';
import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions, CREATE } from 'nestjs-joi';
import { ConnectionDto } from '../connection/connection.dto';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class OrganizationDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  @JoiSchema([CREATE], Joi.string().required())
  readonly name: string;

  @ApiProperty()
  @JoiSchema(Joi.string())
  readonly display_name: string;

  @ApiProperty({
    examples: {
      logo_url: '',
      colors: {},
    },
  })
  @JoiSchema(Joi.object())
  branding?: BrandingDto;

  @ApiProperty()
  @JoiSchema(Joi.object().optional())
  metadata?: any;
}

export class CreateOrganizationDto extends PartialType(OmitType(OrganizationDto, ['id'])) {}

export class UpdateOrganizationDto extends PartialType(OmitType(OrganizationDto, ['id', 'name'])) {}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class OrganizationPageQueryDto extends PageQueryDto {}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class OrganizationMemberPageQueryDto extends PageQueryDto {
  
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class AddOrganizationMembersDto {
  @ApiProperty()
  @JoiSchema(Joi.array().items(Joi.string()).required())
  members: string[];
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class RemoveOrganizationMembersDto {
  @JoiSchema(Joi.array().items(Joi.string()).required())
  members: string[];
}

export class OrganizationEnabledConnectionDto {
  connection_id: string;
  assign_membership_on_login: boolean;
  connection: ConnectionDto;
}

export class UpdateOrganizationEnabledConnectionDto extends OmitType(OrganizationEnabledConnectionDto, [
  'connection_id',
  'connection',
]) {}

export class AddOrganizationEnabledConnectionDto extends PartialType(OmitType(OrganizationEnabledConnectionDto, ['connection'])) {
  connection_id: string;
  assign_membership_on_login: boolean;
}