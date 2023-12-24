import { ApiProperty, OmitType, PartialType, ApiHideProperty } from '@nestjs/swagger';
import { JoiSchemaOptions, JoiSchema, CREATE, UPDATE } from 'nestjs-joi';
import * as Joi from 'joi';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';

export class ConnectionDto {
  @ApiProperty({ description: '身份源ID' })
  id: string;

  @ApiProperty({ description: '身份源唯一标识' })
  @JoiSchema([CREATE], Joi.string().description('身份源名称').required())
  @JoiSchema([UPDATE], Joi.string().description('身份源名称'))
  name: string;

  @ApiProperty({
    name: 'strategy',
    required: true,
    examples: [
      'ad',
      'adfs',
      'amazon',
      'apple',
      'dropbox',
      'bitbucket',
      'aol',
      'authok-oidc',
      'authok',
      'baidu',
      'bitly',
      'box',
      'custom',
      'daccount',
      'dwolla',
      'email',
      'evernote-sandbox',
      'evernote',
      'exact',
      'facebook',
      'fitbit',
      'flickr',
      'github',
      'google-apps',
      'google-oauth2',
      'instagram',
      'ip',
      'linkedin',
      'miicard',
      'oauth1',
      'oauth2',
      'office365',
      'oidc',
      'paypal',
      'paypal-sandbox',
      'pingfederate',
      'planningcenter',
      'renren',
      'salesforce-community',
      'salesforce-sandbox',
      'salesforce',
      'samlp',
      'sharepoint',
      'shopify',
      'sms',
      'soundcloud',
      'thecity-sandbox',
      'thecity',
      'thirtysevensignals',
      'twitter',
      'untappd',
      'vkontakte',
      'waad',
      'weibo',
      'windowslive',
      'wordpress',
      'yahoo',
      'yammer',
      'yandex',
      'line',
      'wechat',
      'douyin',
      'tiktok',
      'alipay',
    ],
  })
  @JoiSchema([CREATE], Joi.string().description('连接策略').required())
  @JoiSchema([UPDATE], Joi.string().description('连接策略'))
  strategy?: string;

  @ApiProperty()
  @JoiSchema(Joi.string().description('连接策略'))
  display_name?: string;

  @ApiProperty({
    required: false,
    example: {
      validation: 'object',
      non_persistent_attrs: [''],
      enabledDatabaseCustomization: false,
      import_mode: false,
      customScripts: 'object',
      passwordPolicy: '',
      password_complexity_options: 'object',
      password_history: 'object',
      password_no_personal_info: 'object',
      password_dictionary: 'object',
      api_enable_users: false,
      basic_profile: false,
      ext_admin: false,
      ext_is_suspended: false,
      ext_agreed_terms: false,
      ext_groups: false,
      ext_assigned_plans: false,
      ext_profile: false,
      upstream_params: 'object',
      set_user_root_attributes: 'on_each_login',
      gateway_authentication: 'object',
    },
  })
  @JoiSchema(Joi.object().description('配置选项'))
  options?: Record<string, any>;

  @ApiProperty()
  @JoiSchema(Joi.object())
  metadata?: Record<string, any>;

  @ApiHideProperty()
  tenant?: string;

  @ApiProperty()
  created_at?: Date;

  @ApiProperty()
  updated_at?: Date;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  @JoiSchema(Joi.array().items(Joi.string()))
  realms: string[];

  @ApiProperty({ name: 'is_domain_connection' })
  @JoiSchema(Joi.boolean())
  is_domain_connection: boolean;

  @ApiProperty({ name: 'enabled_clients' })
  @JoiSchema(Joi.array().items(Joi.string()))
  enabled_clients: string[];
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateConnectionDto extends PartialType(OmitType(ConnectionDto, [
  'id',
])) {}

@JoiSchemaOptions({})
export class UpdateConnectionDto extends PartialType(OmitType(CreateConnectionDto, ['name'])) {}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class ConnectionPageQueryDto extends PageQueryDto {
  @ApiProperty({ description: '身份提供者标识符，等同provider' })
  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  strategy?: string | string[];

  @ApiProperty({ description: '身份源唯一标识' })
  @JoiSchema(Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())))
  name?: string | string[];

  @ApiProperty({ description: '身份源类型' })
  @JoiSchema(Joi.string())
  strategy_type?: string;
}