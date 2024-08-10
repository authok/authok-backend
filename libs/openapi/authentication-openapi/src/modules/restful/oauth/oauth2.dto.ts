import { ApiProperty } from '@nestjs/swagger';
import { JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PasswordlessVerifyReq {
  @ApiProperty({
    required: true,
    description:
      'It should be http://authok.io/oauth/grant-type/passwordless/otp.',
  })
  readonly grant_type: string;

  @ApiProperty({
    required: true,
    description: '应用的 client_id.',
  })
  readonly client_id: string;

  @ApiProperty({
    name: 'client_secret',
    required: true,
    description:
      'The client_secret of your application. Only required for Regular Web Applications.',
  })
  readonly client_secret: string;

  @ApiProperty({
    required: true,
    description:
      '如果 realm=sms 则为用户的电话号码, 如果 realm=email 则为用户的 email.',
  })
  readonly username: string;

  @ApiProperty({
    required: true,
    description:
      'Use sms or email (should be the same as POST /passwordless/start)',
  })
  readonly connection: string;

  @ApiProperty({ required: true, description: '用户的验证码' })
  readonly otp: string;

  @ApiProperty({
    description:
      'API Identifier of the API for which you want to get an Access Token.',
  })
  readonly audience: string;

  @ApiProperty({
    description:
      'Use openid to get an ID Token, or openid profile email to also include user profile information in the ID Token.',
  })
  readonly scope: string;
}

export class MfaVerifyReq extends PasswordlessVerifyReq {
  @ApiProperty({
    name: 'mfa_token',
    description: 'The mfa_token you received from mfa_required error.',
  })
  readonly mfaToken: string;
}

export class OOBMfaVerifyReq extends MfaVerifyReq {
  @ApiProperty({
    name: 'oob_code',
    description: 'The oob code received from the challenge request.',
  })
  readonly oobCode: string;

  @ApiProperty({
    name: 'binding_code',
    description:
      'A code used to bind the side channel (used to deliver the challenge) with the main channel you are using to authenticate. This is usually an OTP-like code delivered as part of the challenge message.',
  })
  readonly bindingCode: string;
}

export class RecoveryCodeMfaVerifyReq extends MfaVerifyReq {
  @ApiProperty({
    name: 'recovery_code',
    description: 'Recovery code provided by the end-user.',
  })
  readonly recoveryCode: string;
}
