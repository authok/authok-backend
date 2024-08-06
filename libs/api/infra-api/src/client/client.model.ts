import {
  ApiProperty,
  ApiHideProperty,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { ClientGrantModel } from '../client-grant/client-grant.model';
import { PageQuery } from 'libs/common/src/pagination/pagination.model';

export class ClientModel {
  display_name?: string;
  client_id: string;
  client_secret: string;
  response_types: string[];
  tenant: string;
  name: string;
  description: string;
  logo_uri: string;
  redirect_uris: string[];
  allowed_origins: string[];
  web_origins: string[];
  client_aliases: string[];
  allowed_clients: string[];
  allowed_logout_urls: string[];
  grant_types: string[];
  token_endpoint_auth_method: string;
  app_type: string;
  is_first_party: boolean;
  oidc_conformant: boolean;
  jwt_configuration: any;
  encryption_key: any;
  sso: boolean;
  cross_origin_auth: boolean;
  cross_origin_loc: string;
  sso_disabled: boolean;
  custom_login_page_on: boolean;
  custom_login_page: string;
  custom_login_page_preview: string;
  form_template: string;
  addons: any;
  client_metadata: Record<string, any>;
  mobile: Record<string, any>;
  initiate_login_uri: string;
  native_social_login: any;
  refresh_token: any;
  organization_usage: string;
  organization_require_behavior: string;
  id_token_signed_response_alg: string;
  require_auth_time: boolean;
  subject_type: string;
  revocation_endpoint_auth_method: string;
  require_signed_request_object: boolean;
  request_uris: string[];
  grants?: ClientGrantModel[];
}

export class CreateClientModel extends PartialType(
  OmitType(ClientModel, ['client_id', 'client_secret']),
) {}

export class UpdateClientModel extends PartialType(
  OmitType(ClientModel, ['client_id']),
) {}

export interface ClientPageQuery extends PageQuery {
  client_id: string | string[];
  app_type: string | string[];
  token_endpoint_auth_method: string | string[];
}
