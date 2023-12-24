import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { UserDto } from '../user/user.dto';
import { OrganizationDto } from './organization.dto';
import { Exclude } from 'class-transformer';

export class OrganizationMemberDto {
  id: string;
  organization: Partial<OrganizationDto>;

  @ApiProperty()
  user_id: string;

  @ApiPropertyOptional()
  picture?: string;

  user: Partial<UserDto>;

  @Exclude()
  @ApiHideProperty()
  tenant: string;
}
