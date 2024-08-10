import { IsEmail, IsMobilePhone, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty()
  readonly displayName?: string;

  @ApiProperty()
  readonly name?: string;

  @ApiProperty()
  @IsEmail()
  readonly description?: string;

  @ApiProperty()
  readonly default: boolean;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty()
  readonly createdBy: string;

  @ApiProperty()
  readonly updatedBy: string;
}
