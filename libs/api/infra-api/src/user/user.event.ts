import { UserModel } from './user.model';

export class UserCreatedEvent {
  user: UserModel;
}

export interface LoginEvent {
  tenant: string;
  ip: string;
  client_id: string;
  user_agent: string;
  user_id: string;
  user_name: string;
  connection: string;
  scope: string;
  audience: string;
  hostname: string;
}

export enum UserEvents {
  Created = 'user.created',
  PasswordChanged = 'user.password_changed',
  Logined = 'user.logined',
}