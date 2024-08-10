import { ApiProperty } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';

export class EmailCredentials {
  @ApiProperty()
  readonly api_user: string;

  @ApiProperty()
  readonly region: string;

  @ApiProperty()
  readonly stmp_host: string;

  @ApiProperty()
  readonly stmp_port: number;

  @ApiProperty()
  readonly stmp_user: string;
}

export class EmailProviderDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly enabled: boolean;

  @ApiProperty()
  default_from_address: string;

  @ApiProperty()
  readonly credentials: EmailCredentials;

  @ApiProperty()
  readonly settings: any;

  @ApiProperty()
  readonly createdAt?: Date;

  @ApiProperty()
  readonly updatedAt?: Date;
}

export class CreateEmailProviderDto extends OmitType(EmailProviderDto, [
  'createdAt',
  'updatedAt',
]) {}

export class UpdateEmailProviderDto extends OmitType(EmailProviderDto, [
  'createdAt',
  'updatedAt',
]) {}
