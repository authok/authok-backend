import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { UserDto } from '../user/user.dto';
import { OrganizationDto } from './organization.dto';
import { Exclude, Expose } from 'class-transformer';
import { RoleDto } from '../role/role.dto';
import { JoiSchemaOptions } from 'nestjs-joi';
import { Allow, IsString } from 'class-validator';

@JoiSchemaOptions({})
export class OrganizationMemberDto {
  id: string;
  organization: Partial<OrganizationDto>;

  @ApiProperty()
  @Expose()
  user_id: string;

  @ApiPropertyOptional()
  picture?: string;

  @ApiProperty()
  user_metadata?: Record<string, any>;

  user?: Partial<UserDto>;

  @Exclude()
  @ApiHideProperty()
  tenant: string;

  @ApiProperty()
  roles?: Pick<RoleDto, 'id' | 'name'>[];
}