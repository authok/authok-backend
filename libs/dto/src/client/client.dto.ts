import {
  ApiProperty,
  ApiHideProperty,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { JoiSchemaOptions, JoiSchema, CREATE, UPDATE } from 'nestjs-joi';
import * as Joi from 'joi';
import { PageQueryDto } from 'libs/common/src/pagination/pagination.dto';
import { ClientGrantDto } from '../client-grant/client-grant.dto';

/**
 * Application
 */
@JoiSchemaOptions({
  allowUnknown: false,
})
export class ClientDto {
  @ApiProperty()
  readonly display_name?: string;

  @ApiProperty()
  @JoiSchema(Joi.string().forbidden())
  readonly client_id: string;

  @ApiProperty()
  @JoiSchema(Joi.string().forbidden())
  readonly client_secret: string;

  @ApiProperty()
  @JoiSchema(Joi.array().items(Joi.string()))
  response_types: string[];

  @ApiProperty({})
  readonly tenant: string;

  @ApiProperty({
    description: 'client的名称 (最小长度: 1个字符, 不允许 < 或 >).',
  })
  @JoiSchema([CREATE], Joi.string().max(32).required())
  @JoiSchema([UPDATE], Joi.string().max(32))
  readonly name: string;

  @ApiProperty({
    description: 'client的描述 (最大长度: 140 字符).',
  })
  @JoiSchema([CREATE], Joi.string().max(32).required())
  @JoiSchema([UPDATE], Joi.string().max(32))
  readonly description: string;

  @ApiProperty({
    description: 'client 的 logo 的 URL. 推荐尺寸 160x160 pixels.',
  })
  @JoiSchema(Joi.string())
  readonly logo_uri: string;

  @ApiProperty({
    description: 'authok 认证成功后的回调 url 白名单, 以逗号分割.',
  })
  @JoiSchema(Joi.array().items(Joi.string()))
  readonly redirect_uris: string[];

  @ApiProperty({
    description:
      'Comma-separated list of URLs allowed to make requests from JavaScript to Auth0 API (typically used with CORS). By default, all your callback URLs will be allowed. This field allows you to enter other origins if necessary. You can also use wildcards at the subdomain level (e.g., https://*.contoso.com). Query strings and hash information are not taken into account when validating these URLs.',
  })
  @JoiSchema(Joi.array().items(Joi.string()))
  readonly allowed_origins: string[];

  @ApiProperty({
    description:
      'Comma-separated list of allowed origins for use with Cross-Origin Authentication, Device Flow, and web message response mode.',
  })
  @JoiSchema(Joi.array().items(Joi.string()))
  readonly web_origins: string[];

  @ApiProperty({
    description:
      'List of audiences/realms for SAML protocol. Used by the wsfed addon.',
  })
  @JoiSchema(Joi.array().items(Joi.string()))
  readonly client_aliases: string[];

  @ApiProperty({
    description:
      'List of allow clients and API ids that are allowed to make delegation requests. Empty means all all your clients are allowed.',
  })
  @JoiSchema(Joi.array().items(Joi.string()))
  readonly allowed_clients: string[];

  @ApiProperty({
    description:
      'Comma-separated list of URLs that are valid to redirect to after logout from Auth0. Wildcards are allowed for subdomains.',
  })
  @JoiSchema(Joi.array().items(Joi.string()))
  readonly allowed_logout_urls: string[];

  @ApiProperty({
    description: 'List of grant types supported for this application.',
    examples: [
      'authorization_code',
      'implicit',
      'refresh_token',
      'client_credentials',
      'password',
      'http://authok.io/oauth/grant-type/password-realm',
      'http://authok.io/oauth/grant-type/mfa-oob',
      'http://authok.io/oauth/grant-type/mfa-otp',
      'http://authok.io/oauth/grant-type/passwordless/otp',
      'http://authok.io/oauth/grant-type/mfa-recovery-code',
      'urn:ietf:params:oauth:grant-type:device_code',
    ],
  })
  @JoiSchema(
    Joi.array().items(
      Joi.string().valid(
        'authorization_code',
        'implicit',
        'refresh_token',
        'client_credentials',
        'password',
        'http://authok.io/oauth/grant-type/password-realm',
        'http://authok.io/oauth/grant-type/mfa-oob',
        'http://authok.io/oauth/grant-type/mfa-otp',
        'http://authok.io/oauth/grant-type/passwordless/otp',
        'http://authok.io/oauth/grant-type/mfa-recovery-code',
        'urn:ietf:params:oauth:grant-type:device_code',
      ),
    ),
  )
  readonly grant_types: string[];

  @ApiProperty({
    enum: [
      'client_secret_basic',
      'client_secret_jwt',
      'client_secret_post',
      'private_key_jwt',
      'none',
    ],
    default: 'none',
  })
  @JoiSchema(
    Joi.string().valid(
      'client_secret_basic',
      'client_secret_jwt',
      'client_secret_post',
      'private_key_jwt',
      'none',
    ),
  )
  readonly token_endpoint_auth_method: string;

  // 'web', 'native', 'non_interactive', 'spa'
  @ApiProperty({})
  @JoiSchema([CREATE], Joi.string().required())
  @JoiSchema([UPDATE], Joi.string())
  readonly app_type: string;

  @ApiProperty({})
  @JoiSchema(Joi.boolean())
  readonly is_first_party: boolean;

  @ApiProperty({})
  @JoiSchema(Joi.boolean())
  readonly oidc_conformant: boolean;

  @ApiProperty({
    example: {
      lifetime_in_seconds: 0,
      scopes: {},
      alg: '',
    },
  })
  @JoiSchema(
    Joi.object({
      lifetime_in_seconds: Joi.number(),
      scopes: Joi.object(),
      alg: Joi.string(),
    }),
  )
  readonly jwt_configuration: any;

  @ApiProperty({
    example: {
      pub: '',
      cert: '',
      subject: '',
    },
    description: 'Encryption used for WsFed responses with this client.',
  })
  @JoiSchema(
    Joi.object({
      pub: Joi.string(),
      cert: Joi.string(),
      subject: Joi.string(),
    }),
  )
  readonly encryption_key: any;

  @ApiProperty({
    description:
      'Applies only to SSO clients and determines whether Auth0 will handle Single Sign On (true) or whether the Identity Provider will (false).',
  })
  @JoiSchema(Joi.boolean())
  readonly sso: boolean;

  @ApiProperty({
    description:
      'Whether this client can be used to make cross-origin authentication requests (true) or it is not allowed to make such requests (false).',
  })
  @JoiSchema(Joi.boolean())
  readonly cross_origin_auth: boolean;

  @ApiProperty({
    description:
      'URL of the location in your site where the cross origin verification takes place for the cross-origin auth flow when performing Auth in your own domain instead of Auth0 hosted login page.',
  })
  @JoiSchema(Joi.string())
  readonly cross_origin_loc: string;

  @ApiProperty({
    description:
      'true to disable Single Sign On, false otherwise (default: false)',
  })
  @JoiSchema(Joi.boolean())
  readonly sso_disabled: boolean;

  @ApiProperty({
    description:
      'true if the custom login page is to be used, false otherwise. Defaults to true',
  })
  @JoiSchema(Joi.boolean())
  readonly custom_login_page_on: boolean;

  @ApiProperty({
    description: 'The content (HTML, CSS, JS) of the custom login page.',
  })
  @JoiSchema(Joi.string())
  readonly custom_login_page: string;

  @ApiProperty({
    description: '自定义登录页面的内容 (HTML, CSS, JS). (Used on Previews)',
  })
  @JoiSchema(Joi.string())
  readonly custom_login_page_preview: string;

  @ApiProperty({
    description: 'HTML form template to be used for WS-Federation.',
  })
  @JoiSchema(Joi.string())
  readonly form_template: string;

  @ApiProperty({
    description:
      'Addons enabled for this client and their associated configurations.',
    example: {
      aws: {},
      azure_blob: {},
      azure_sb: {},
      rms: {},
      mscrm: {},
      slack: {},
      sentry: {},
      box: {},
      cloudbees: {},
      concur: {},
      dropbox: {},
      echosign: {},
      egnyte: {},
      firebase: {},
      newrelic: {},
      office365: {},
      salesforce: {},
      salesforce_api: {},
      salesforce_sandbox_api: {},
      samlp: {},
      layer: {},
      sap_api: {},
      sharepoint: {},
      springcm: {},
      wams: {},
      wsfed: {},
      zendesk: {},
      zoom: {},
      sso_integration: 'object',
    },
  })
  @JoiSchema(Joi.object())
  readonly addons: any;

  @ApiProperty({
    description:
      'Metadata associated with the client, in the form of an object with string values (max 255 chars). Maximum of 10 metadata properties allowed. Field names (max 255 chars) are alphanumeric and may only include the following special characters: :,-+=_*?"/()<>@ [Tab] [Space]',
  })
  @JoiSchema(Joi.object())
  readonly client_metadata: Record<string, any>;

  @ApiProperty({
    description: 'Additional configuration for native mobile apps.',
    example: {
      android: {
        app_package_name: 'com.example',
        sha256_cert_fingerprints: ['D8:A0:83:...'],
      },
      ios: {
        team_id: '9JA89QQLNQ',
        app_bundle_identifier: 'com.my.bundle.id',
      },
    },
  })
  @JoiSchema(
    Joi.object({
      android: Joi.object({
        app_package_name: Joi.string(),
        sha256_cert_fingerprints: Joi.array().items(Joi.string()),
      }),
      ios: Joi.object({
        team_id: Joi.string(),
        app_bundle_identifier: Joi.string(),
      }),
    }),
  )
  mobile: Record<string, any>;

  @ApiProperty({ description: 'Initiate login uri, must be https' })
  @JoiSchema(Joi.string().allow(''))
  readonly initiate_login_uri: string;

  @ApiProperty({
    description: 'Configure native social settings',
    example: {
      apple: 'object',
      facebook: 'object',
    },
  })
  @JoiSchema(
    Joi.object().example({
      apple: 'object',
      facebook: 'object',
    }),
  )
  readonly native_social_login: any;

  @ApiProperty({
    description: 'Refresh token configuration',
    example: {
      rotation_type: 'non-rotating',
      expiration_type: 'non-expiring',
      leeway: 0,
      token_lifetime: 0,
      infinite_token_lifetime: false,
      idle_token_lifetime: 0,
      infinite_idle_token_lifetime: false,
    },
  })
  @JoiSchema(
    Joi.object().example({
      rotation_type: 'non-rotating',
      expiration_type: 'non-expiring',
      leeway: 0,
      token_lifetime: 0,
      infinite_token_lifetime: false,
      idle_token_lifetime: 0,
      infinite_idle_token_lifetime: false,
    }),
  )
  readonly refresh_token: any;

  @ApiProperty({
    description:
      'Defines how to proceed during an authentication transaction with regards an organization. Can be deny (default), allow or require.',
    example: 'deny',
  })
  @JoiSchema(Joi.string())
  readonly organization_usage: string;

  @ApiProperty({
    description:
      "Defines how to proceed during an authentication transaction when client.organization_usage: 'require'. Can be no_prompt (default) or pre_login_prompt.",
    default: 'no_prompt',
    examples: ['no_prompt', 'pre_login_prompt'],
  })
  @JoiSchema(Joi.string())
  readonly organization_require_behavior: string;

  //------------------------------ oidc-proivder
  @ApiHideProperty()
  id_token_signed_response_alg: string;

  @ApiHideProperty()
  require_auth_time: boolean;

  @ApiHideProperty()
  subject_type: string;

  @ApiHideProperty()
  revocation_endpoint_auth_method: string;

  @ApiHideProperty()
  require_signed_request_object: boolean;

  @ApiHideProperty()
  request_uris: string[];

  @ApiHideProperty()
  grants?: ClientGrantDto[];
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateClientDto extends PartialType(
  OmitType(ClientDto, ['client_id', 'client_secret']),
) {}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UpdateClientDto extends PartialType(
  OmitType(ClientDto, ['client_id']),
) {}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class ClientPageQueryDto extends PageQueryDto {
  @JoiSchema(
    Joi.alternatives(Joi.string().allow(''), Joi.array().items(Joi.string())),
  )
  client_id: string | string[];

  @JoiSchema(
    Joi.alternatives(Joi.string().allow(''), Joi.array().items(Joi.string())),
  )
  app_type: string | string[];

  @JoiSchema(
    Joi.alternatives(Joi.string().allow(''), Joi.array().items(Joi.string())),
  )
  token_endpoint_auth_method: string | string[];
}
