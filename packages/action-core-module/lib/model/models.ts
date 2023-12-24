import { IEvent } from '../event';
import { ICommand } from '../command';

export interface IWebRequest {
  ip: any;
  method: string;
  body: any;
  query: any;
  hostname: string;
  user_agent: string;
  language: string;
  geoip: any;
  headers: Record<string, string | string[]>;
}

export interface IIdentity {
  user_id: string;
  provider: string;
}

export interface IUser {
  user_id: string;
  username: string;

  identities: IIdentity[];
}

export interface ITenant {
  id: string;
}

export interface IConnection {
  id: string;
  name: string;
  strategy: string;
  metadata: Record<string, any>;
}

export interface IOrganization {
  id: string;
  name: string;
  display_name: string;
  metadata: Record<string, any>;
}

export interface IResourceServer {
  identifier: string;
}

export interface IClient {
  client_id: string;
  name: string;
  metadata: Record<string, any>;
}

export interface ITransaction {
  protocol: string;
  prompt: string[];
  locale: string;
  requested_scopes: string[];
  redirect_uri: string;
  login_hint: string;
  response_mode: string;
  response_type: string[];
  state: string;
}

export interface IAuthorization {
  roles: string[];
}

export class TriggerEvent implements IEvent {
  code: string; // 主要在调试模式下使用
  secrets: Record<string, any>;
  request: IWebRequest;
  tenant: ITenant;
  transaction: ITransaction;
  user: IUser;
  client: IClient;
  connection: IConnection;
  resource_server: IResourceServer;
  authorization: IAuthorization;
  organization?: IOrganization;
}

export interface IError {
  name: string;
  message: string;
  stack: string;
}

export class TriggerResult {
  commands: ICommand[];
  logs: any[];
  errors: IError[];
}
