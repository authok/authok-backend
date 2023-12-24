import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { JoiSchemaOptions, JoiSchemaExtends, JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({})
export class PasswordlessStartReq {
  @ApiProperty({ required: true, description: '' })
  @IsNotEmpty()
  readonly client_id: string;

  @ApiProperty({ required: true, description: '' })
  @IsNotEmpty()
  readonly connection: string;

  @ApiProperty()
  readonly scene: string;

  @ApiProperty({ description: '' })
  readonly email?: string;

  @ApiProperty({ description: '' })
  readonly phone_number?: string;

  @ApiProperty({
    name: 'send',
    description:
      'Use link to send a link or code to send a verification code. If null, a link will be sent.',
    examples: ['code', 'link'],
  })
  readonly send?: string;

  @ApiProperty({
    name: 'auth_params',
    description:
      'Use this to append or override the link parameters (like scope, redirect_uri, protocol, response_type), when you send a link using email.',
  })
  readonly authParams?: Record<string, any>;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class PasswordlessVerifyReq {
  @JoiSchema(Joi.string().required())
  client_id: string;

  @JoiSchema(Joi.string().required())
  connection: string;

  @JoiSchema(Joi.string().required())
  verification_code: string;

  @JoiSchema(Joi.string())
  phone_number: string;

  @JoiSchema(Joi.string())
  email: string;
}