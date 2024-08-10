import { ApiProperty } from '@nestjs/swagger';

export class ChallengeReq {
  @ApiProperty({ name: 'mfa_token', required: true, description: '' })
  readonly mfaToken: string;

  @ApiProperty({ name: 'client_id', required: true, description: '' })
  readonly clientId: string;

  @ApiProperty({
    name: 'client_secret',
    description:
      "Your application's Client Secret. Required when the Token Endpoint Authentication Method field at your Application Settings is Post or Basic.",
  })
  readonly clientSecret: string;

  @ApiProperty({
    name: 'challenge_type',
    description:
      'A whitespace-separated list of the challenges types accepted by your application. Accepted challenge types are oob or otp. Excluding this parameter means that your client application accepts all supported challenge types.',
  })
  readonly challengeType: string;

  @ApiProperty({
    name: 'authenticator_id',
    description:
      'The ID of the authenticator to challenge. You can get the ID by querying the list of available authenticators for the user as explained on List authenticators below.',
  })
  readonly authenticatorId: string;
}

export class ChallengeRes {
  @ApiProperty({ name: 'challenge_type', description: '' })
  readonly challengeType: string;

  @ApiProperty({ name: 'oob_code', description: '' })
  readonly oobCode: string;
}

export class OOBChallengeRes extends ChallengeRes {
  @ApiProperty({ name: 'binding_method', description: '' })
  readonly bindingMethod: string;
}

export class AssociateReq {
  @ApiProperty({ name: 'client_id', required: true, description: '' })
  readonly clientId: string;

  @ApiProperty({ name: 'client_secret', description: '' })
  readonly clientSecret: string;

  @ApiProperty({
    name: 'authenticator_types',
    required: true,
    example: ['oob'],
    description: '',
  })
  readonly authenticatorTypes: string[];

  @ApiProperty({
    name: 'oob_channel',
    required: true,
    examples: ['sms', 'voice'],
    description:
      'The type of OOB channels supported by the client. An array with values "authok", "sms", "voice". Required if authenticator_types include oob.',
  })
  readonly oobChannel: string;

  @ApiProperty({
    name: 'phone_number',
    description: '',
  })
  readonly phoneNumber: string;
}

export class AssociateRes {
  @ApiProperty({ name: 'secret', description: '' })
  readonly secret: string;

  @ApiProperty({ name: 'barcode_uri', description: '' })
  readonly barcodeUri: string;

  @ApiProperty({ name: 'authenticator_types', description: '' })
  readonly authenticatorType: string[];

  @ApiProperty({ name: 'recovery_codes', description: '' })
  readonly recoveryCodes: string[];
}

export class AuthenticatorDto {}
