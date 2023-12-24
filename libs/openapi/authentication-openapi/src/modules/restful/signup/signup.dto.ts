import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({})
export class SignupReq {
  @ApiProperty({ required: true, description: '' })
  @JoiSchema(Joi.string())
  readonly client_id: string;

  @ApiProperty({ name: 'email', description: '' })
  @JoiSchema(Joi.string())
  readonly email: string;

  @ApiProperty({ name: 'phone_number', description: '' })
  @JoiSchema(Joi.string())
  readonly phone_number: string;

  @ApiProperty({ name: 'password', required: true, description: '' })
  @IsNotEmpty()
  @JoiSchema(Joi.string().required())
  readonly password: string;

  @ApiProperty({ name: 'connection', required: true, description: '' })
  @IsNotEmpty()
  @JoiSchema(Joi.string().required())
  readonly connection: string;

  @ApiProperty({ name: 'username', description: '' })
  @JoiSchema(Joi.string())
  readonly username: string;

  @ApiProperty({ description: '' })
  @JoiSchema(Joi.string())
  readonly given_name: string;

  @ApiProperty({ description: '' })
  @JoiSchema(Joi.string())
  readonly family_name: string;

  @ApiProperty({ name: 'name', description: '' })
  @JoiSchema(Joi.string())
  readonly name: string;

  @ApiProperty({ name: 'nickname', description: '' })
  @JoiSchema(Joi.string())
  readonly nickname: string;

  @ApiProperty({ name: 'picture', description: '' })
  @JoiSchema(Joi.string())
  readonly picture: string;

  @ApiProperty({ name: 'metadata', description: '' })
  @JoiSchema(Joi.object())
  readonly metadata: any;

  @ApiProperty({ description: '' })
  @JoiSchema(Joi.string())
  readonly user_type: string;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class ChangePasswordReq {
  @ApiProperty({ description: '' })
  @JoiSchema(Joi.string().required())
  readonly client_id: string;

  @ApiProperty({ description: '邮件找回密码' })
  @JoiSchema(Joi.string())
  readonly email: string;

  @ApiProperty({ required: true, description: '' })
  @JoiSchema(Joi.string().required())
  readonly connection: string;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class ChangePasswordDirectlyReq {
  @ApiProperty({ description: '' })
  @JoiSchema(Joi.string().required())
  readonly client_id: string;

  @ApiProperty({ description: '', examples: ['sms', 'email'] })
  @JoiSchema(Joi.string().required())
  readonly realm: string;

  @ApiProperty({ required: true, description: '' })
  @JoiSchema(Joi.string().required())
  readonly connection: string;

  @ApiProperty({ description: '验证码' })
  @JoiSchema(Joi.string().required())
  readonly vcode: string;

  @ApiProperty({ description: 'realm 为 sms, 则对应 phoneNumber, realm 为 email 则对应 email' })
  @JoiSchema(Joi.string().required())
  readonly username: string;
 
  @ApiProperty()
  @JoiSchema(Joi.string().required())
  readonly password: string;
}
