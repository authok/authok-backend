import { ApiProperty } from '@nestjs/swagger';

export class GetDeviceCodeReq {
  @ApiProperty({ name: 'audience' })
  readonly audience: string;

  @ApiProperty({ name: 'scope' })
  readonly scope: string;

  @ApiProperty({ name: 'client_id', required: true })
  readonly clientId: string;
}

export class GetDeviceCodeRes {
  @ApiProperty({ name: 'device_code', description: '' })
  readonly deviceCode: string;

  @ApiProperty({ name: 'user_code', description: '' })
  readonly userCode: string;

  @ApiProperty({ name: 'verification_uri', description: '' })
  readonly verificationUri: string;

  @ApiProperty({ name: 'verification_uri_complete', description: '' })
  readonly verificationUriComplete: string;

  @ApiProperty({ name: 'expires_in', description: '' })
  readonly expiresIn: string;

  @ApiProperty({ name: 'interval', description: '' })
  readonly interval: string;
}

export class GetTokenReq {
  @ApiProperty({
    name: 'grant_type',
    required: true,
    description:
      'Denotes the flow you are using. For Authorization Code, use authorization_code.',
  })
  readonly grantType: string;

  @ApiProperty({
    name: 'client_id',
    required: true,
    description: "Your application's Client ID.",
  })
  readonly clientId: string;

  @ApiProperty({
    name: 'client_secret',
    description: "Your application's Client Secret.",
  })
  readonly clientSecret: string;

  @ApiProperty({
    name: 'code',
    description:
      'The Authorization Code received from the initial /authorize call.',
  })
  readonly code: string;

  @ApiProperty({
    name: 'redirect_uri',
    description:
      'This is required only if it was set at the GET /authorize endpoint. The values must match.',
  })
  readonly redirect_uri: string;
}
