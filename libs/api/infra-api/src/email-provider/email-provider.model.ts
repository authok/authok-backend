import { OmitType } from '@nestjs/swagger';

export class EmailCredentials {
  api_user: string;
  region: string;
  stmp_host: string;
  stmp_port: number;
  stmp_user: string;
}

export class EmailProviderModel {
  name: string;
  enabled: boolean;
  default_from_address: string;
  credentials: EmailCredentials;
  settings: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CreateEmailProviderModel extends OmitType(EmailProviderModel, [
  'createdAt',
  'updatedAt',
]) {}

export class UpdateEmailProviderModel extends OmitType(EmailProviderModel, [
  'createdAt',
  'updatedAt',
]) {}
