import { EntitySchema } from 'typeorm';

export type TypeORMEntities =
  | string
  | Function
  | (new () => unknown)
  | EntitySchema<unknown>;
export type KindOfId = number | string;

export interface IClientMetadata {
  client_id: string;
  client_secret: string;
  grant_types: string[];
  redirect_uris: string[];
  response_types: string[];
  token_endpoint_auth_method: string;
}

export interface INewRole {
  userId: string;
  clientId: string;
  roleId: string;
}
