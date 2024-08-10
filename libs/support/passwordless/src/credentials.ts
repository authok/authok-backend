import { AbstractCredentials } from 'libs/api/authentication-api/src';

export class PasswordlessCredentials extends AbstractCredentials {
  otp: string;
  phone_number: string;
  email: string;
}
