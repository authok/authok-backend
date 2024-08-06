import { OmitType } from '@nestjs/swagger';

export class KeyModel {
  kid: string;
  cert: string;
  spki: string;
  pkcs8: string;
  pkcs7: string;
  current: boolean;
  next: boolean;
  previous: boolean;
  currentSince: Date;
  currentUntil: Date;
  fingerprint: string;
  thumbprint: string;
  revoked: boolean;
  revokedAt: Date;
}

export class CreateKeyModel extends OmitType(KeyModel, ['kid']) {}

export class UpdateKeyModel extends OmitType(KeyModel, ['kid']) {}
