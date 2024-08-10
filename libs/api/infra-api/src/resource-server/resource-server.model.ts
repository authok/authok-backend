import { OmitType, PartialType } from '@nestjs/swagger';
import { ClientModel } from '../client/client.model';
import { PageQuery } from 'libs/common/src/pagination/pagination.model';

export class ResourceServerModel {
  id: string;
  name: string;
  identifier: string;
  is_system: boolean;
  scopes: { description: string; value: string }[];
  signing_alg: string;
  signing_secret: string;
  allow_offline_access: boolean;
  skip_consent_for_verifiable_first_party_clients: boolean;
  token_lifetime: number;
  token_lifetime_for_web: number;
  enforce_policies: boolean;
  token_dialect: string;
  client: Partial<ClientModel>;
}

export class CreateResourceServerModel extends PartialType(OmitType(ResourceServerModel, [
  'id',
  'client',
])) {}

export class UpdateResourceServerModel extends PartialType(OmitType(CreateResourceServerModel, [
  'identifier',
])) {}


export interface ResourceServerPageQuery extends PageQuery {
  is_system?: boolean;
  id?: string | string[];
  identifier?: string | string[];
  enforce_policies?: boolean;
}