import { OmitType, PickType, PartialType } from '@nestjs/swagger';
import { KeyModel } from '../key/key.model';

class JwtConfiguration {
  alg: string;
  lifetime_in_seconds: number;
  secret_encoded: boolean;
}

export class TenantModel {
  id: string;
  name: string;
  display_name: string;
  domain?: string;
  description: string;
  region: string;
  environment: string;
  change_password?: Record<string, any>;
  device_flow?: Record<string, any>;
  guardian_mfa_page?: Record<string, any>;
  default_audience?: string;
  default_connection?: string;
  error_page?: Record<string, any>;
  flags?: Record<string, boolean>;
  picture?: string;
  support_email?: string;
  support_url?: string;
  allowed_logout_urls?: string[];
  session_lifetime?: number;
  idle_session_lifetime?: number;
  sandbox_version?: string;
  default_redirection_uri?: string;
  enabled_locales?: string[];
  session_cookie?: Record<string, any>;
  signing_keys?: KeyModel[];
  jwt_configuration?: JwtConfiguration;
  config?: Record<string, any>;
}

export class CreateTenantModel extends PartialType(PickType(TenantModel, [
  'name',
  'display_name',
  'description',
  'region',
  'environment',
  'jwt_configuration',
])) {}

export class UpdateTenantModel extends PartialType(OmitType(TenantModel, ['id'])) {}