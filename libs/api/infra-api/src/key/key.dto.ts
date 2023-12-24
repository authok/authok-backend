import { ApiProperty, OmitType } from '@nestjs/swagger';

export class KeyDto {
  @ApiProperty({ description: 'The key id of the signing key' })
  readonly kid: string;

  @ApiProperty({
    description: 'The public certificate of the signing key',
    example:
      '-----BEGIN CERTIFICATE-----\r\nMIIDDTCCA...YiA0TQhAt8=\r\n-----END CERTIFICATE-----',
  })
  readonly cert: string;

  @ApiProperty({})
  readonly spki: string;

  @ApiProperty({})
  readonly pkcs8: string;

  @ApiProperty({
    description: 'The public certificate of the signing key in pkcs7 format',
    example:
      '-----BEGIN PKCS7-----\r\nMIIDPA....t8xAA==\r\n-----END PKCS7-----',
  })
  readonly pkcs7: string;

  @ApiProperty({ description: 'True if the key is the the current key' })
  readonly current: boolean;

  @ApiProperty({ description: 'True if the key is the the next key' })
  readonly next: boolean;

  @ApiProperty({ description: 'True if the key is the the previous key' })
  readonly previous: boolean;

  @ApiProperty({
    name: 'current_since',
    description: 'The date and time when the key became the current key',
  })
  readonly currentSince: Date;

  @ApiProperty({
    name: 'current_until',
    description: 'The date and time when the current key was rotated',
  })
  readonly currentUntil: Date;

  @ApiProperty({
    description: 'The cert fingerprint',
    example: 'CC:FB:DD:D8:9A:B5:DE:1B:F0:CC:36:D2:99:59:21:12:03:DD:A8:25',
  })
  readonly fingerprint: string;

  @ApiProperty({
    description: 'The cert thumbprint',
    example: 'CCFBDDD89AB5DE1BF0CC36D29959211203DDA825',
  })
  readonly thumbprint: string;

  @ApiProperty({
    description: 'True if the key is revoked',
  })
  readonly revoked: boolean;

  @ApiProperty({
    name: 'revoked_at',
    description: 'The date and time when the key was revoked',
  })
  readonly revokedAt: Date;
}

export class CreateKeyDto extends OmitType(KeyDto, ['kid']) {}

export class UpdateKeyDto extends OmitType(KeyDto, ['kid']) {}
