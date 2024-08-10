import { ProfileDataModel } from "libs/api/infra-api/src";

export interface IPrincipal {
  user_id: string;
}

export interface ICredentials {
  credential_type: string;

  [key: string]: any;
}

export abstract class AbstractCredentials implements ICredentials {
  credential_type: string;
  client_id: string;
  connection: string;
}

export type LoginCallback = (err: Error, profile: ProfileDataModel) => void;

export interface LoginFunc {
  (credentials: ICredentials, callback: LoginCallback): void;
}