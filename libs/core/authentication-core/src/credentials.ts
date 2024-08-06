import { AbstractCredentials } from 'libs/api/authentication-api/src';

export class PasswordCredentials extends AbstractCredentials {
  username?: string;
  email?: string;
  phone_number?: string;
  password: string;
}
