import { ApiProperty } from '@nestjs/swagger';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

@JoiSchemaOptions({})
export class EmailTemplateDto {
  @ApiProperty({
    enum: [
      'verify_email',
      'verify_email_by_code',
      'reset_email',
      'welcome_email',
      'blocked_account',
      'stolen_credentials',
      'enrollment_email',
      'mfa_oob_code',
      'user_invitation',
      'change_password',
    ],
  })
  @JoiSchema(['CREATE'], Joi.string().required())
  template: string;

  @ApiProperty({ description: '模版内容' })
  @JoiSchema(['CREATE'], Joi.string().required())
  body: string;

  @ApiProperty({ description: '发送者地址' })
  @JoiSchema(['CREATE'], Joi.string().required())
  from: string;

  @ApiProperty({ description: '操作成功后的重定向地址' })
  @JoiSchema(Joi.string().optional())
  result_url: string;

  @ApiProperty({ description: '标题' })
  @JoiSchema(['CREATE'], Joi.string().required())
  subject: string;

  @ApiProperty({ description: '语法, 决定使用哪种模版引擎, 默认是 liquid' })
  @JoiSchema(Joi.string().default('liquid'))
  syntax: string;

  @ApiProperty()
  @JoiSchema(Joi.number().default(60))
  url_lifetime_in_seconds: number;

  @ApiProperty()
  @JoiSchema(Joi.boolean().default(false))
  include_email_in_redirect: boolean;

  @ApiProperty({ default: true })
  @JoiSchema(Joi.boolean().default(true))
  enabled: boolean;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class EmailTemplatePageQueryDto extends PageQueryDto {
  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  template: string | string[];
}