import { ApiProperty, OmitType, PickType, PartialType } from '@nestjs/swagger';
import { KeyDto } from '../key/key.dto';
import { IsNotEmpty } from 'class-validator';
import { JoiSchema, JoiSchemaOptions, CREATE } from 'nestjs-joi';
import * as Joi from 'joi';

class JwtConfiguration {
  alg: string;
  lifetime_in_seconds: number;
  secret_encoded: boolean;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class TenantDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty({ description: '租户域名唯一标识符' })
  @IsNotEmpty()
  @JoiSchema([CREATE], Joi.string().required())
  name: string;

  @ApiProperty({ description: '可读名称' })
  @IsNotEmpty()
  @JoiSchema([CREATE], Joi.string().required())
  display_name: string;

  domain: string;

  @ApiProperty()
  @JoiSchema(Joi.string())
  readonly description: string;

  @ApiProperty()
  @JoiSchema([CREATE], Joi.string().required())
  readonly region: string;

  @ApiProperty()
  @JoiSchema(Joi.string().default('development'))
  environment: string;

  @ApiProperty({
    description: 'Change Password page customization.',
    example: {
      enabled: true,
      html: '',
    },
  })
  readonly change_password?: Record<string, any>;

  @ApiProperty({
    description: 'Device Flow configuration.',
    example: {
      charset: '',
      mask: '',
    },
  })
  readonly device_flow?: Record<string, any>;

  @ApiProperty({
    description: 'Guardian page customization.',
    example: {
      enabled: true,
      html: '',
    },
  })
  readonly guardian_mfa_page?: Record<string, any>;

  @ApiProperty({
    description: 'Default audience for API Authorization.',
  })
  readonly default_audience?: string;

  @ApiProperty({
    description:
      'Name of connection used for password grants at the /token endpoint. The following connection types are supported: LDAP, AD, Database Connections, Passwordless, Windows Azure Active Directory, ADFS.',
  })
  readonly default_connection?: string;

  @ApiProperty({
    description: 'Error page customization.',
    example: {
      html: '',
      show_log_link: true,
      url: '',
    },
  })
  readonly error_page?: Record<string, any>;

  @ApiProperty({
    description: 'Flags used to change the behavior of this tenant.',
    example: {
      change_pwd_flow_v1: true,
      enable_client_connections: true,
      enable_apis_section: true,
      enable_pipeline2: true,
      enable_dynamic_client_registration: true,
      enable_custom_domain_in_emails: true,
      allow_legacy_tokeninfo_endpoint: true,
      enable_legacy_profile: true,
      enable_idtoken_api2: true,
      enable_public_signup_user_exists_error: true,
      allow_legacy_delegation_grant_types: true,
      allow_legacy_ro_grant_types: true,
      enable_sso: true,
      disable_clickjack_protection_headers: true,
      no_disclose_enterprise_connections: true,
      disable_management_api_sms_obfuscation: true,
      enforce_client_authentication_on_passwordless_start: true,
      trust_azure_adfs_email_verified_connection_property: true,
      enable_adfs_waad_email_verification: true,
      revoke_refresh_token_grant: true,
      dashboard_log_streams_next: true,
      dashboard_insights_view: true,
    },
  })
  readonly flags?: Record<string, boolean>;

  @ApiProperty({
    description:
      'URL of logo to be shown for this tenant (recommended size: 150x150)',
  })
  readonly picture?: string;

  @ApiProperty({
    description: 'End-user support email.',
  })
  readonly support_email?: string;

  @ApiProperty({ description: 'End-user support url.' })
  readonly support_url?: string;

  @ApiProperty({
    description: 'URLs that are valid to redirect to after logout from Auth0.',
  })
  readonly allowed_logout_urls: string[];

  @ApiProperty({
    description: 'Number of hours a session will stay valid.',
  })
  readonly session_lifetime: number;

  @ApiProperty({
    description:
      'Number of hours for which a session can be inactive before the user must log in again.',
  })
  readonly idle_session_lifetime: number;

  @ApiProperty({
    description: 'Selected sandbox version for the extensibility environment',
  })
  readonly sandbox_version?: string;

  @ApiProperty({
    description: 'The default absolute redirection uri, must be https',
  })
  readonly default_redirection_uri?: string;

  @ApiProperty({
    description: 'Supported locales for the user interface',
  })
  readonly enabled_locales?: string[];

  @ApiProperty({
    description: 'Session cookie configuration',
    examples: {
      mode: 'persistent',
    },
  })
  readonly session_cookie?: Record<string, any>;

  @ApiProperty()
  signing_keys?: KeyDto[];

  @ApiProperty()
  readonly jwt_configuration?: JwtConfiguration;

  @ApiProperty()
  readonly config: Record<string, any>;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateTenantDto extends PartialType(PickType(TenantDto, [
  'name',
  'display_name',
  'description',
  'region',
  'environment',
  'jwt_configuration',
])) {}

export class UpdateTenantDto extends PartialType(OmitType(TenantDto, ['id'])) {}