import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { UserDto } from '../user/user.dto';
import { OrganizationDto } from './organization.dto';
import { Exclude } from 'class-transformer';
import { RoleDto } from '../role/role.dto';

export class OrganizationMemberDto {
  id: string;
  organization: Partial<OrganizationDto>;

  @ApiProperty()
  user_id: string;

  @ApiPropertyOptional()
  picture?: string;

  @ApiProperty()
  user_metadata?: Record<string, any>;

  user: Partial<UserDto>;

  @Exclude()
  @ApiHideProperty()
  tenant: string;

  @ApiProperty()
  roles?: Pick<RoleDto, 'id' | 'name'>[];
}