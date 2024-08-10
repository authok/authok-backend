import { GroupModel } from '../group/group.model';
import { IdentityModel } from '../identity/identity.model';
import { OmitType, PickType } from '@nestjs/swagger';
import { PermissionModel } from '../permission/permission.model';
import { UserRoleModel } from './user-role.model';

export class UserModel {
  id: string;
  user_id: string;
  connection: string;
  name?: string;
  email?: string;
  description: string;
  email_verified?: boolean;
  phone_number?: string;
  phone_country_code: string;
  phone_number_verified: boolean;
  logins_count?: number;
  blocked: boolean;
  identities: IdentityModel[];
  roles?: UserRoleModel[];
  groups?: GroupModel[];
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  signup_at: Date;
  updated_at: Date;
  created_at: Date;
  username: string;
  nickname: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  tenant: string;
  verify_email: boolean;
  gender: number;
  birthdate: string;
  locale: string;
  country: string;
  city: string;
  province: string;
  region: string;
  address: string;
  postal_code: string;
  password: string;
  signup_ip?: string;
  last_login: Date;
  last_ip?: string;
  secret2fa: string;
  enabled2fa: boolean;
}


export class CreateUserModel {
  user_id?: string;
  connection: string;
  email?: string;
  phone_number?: string;
  username?: string;
  picture?: string;
  gender?: number;
  force_reset_password?: boolean;
  nickname?: string;
  name?: string;
  phone_number_verified?: boolean;
  given_name?: string;
  family_name?: string;
  password?: string;
  verify_email?: boolean = false;
  email_verified?: boolean = false;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  blocked?: boolean;
  signup_ip?: string;
  signup_at?: Date;
  last_login?: Date;
  last_ip?: string;
  identities?: IdentityModel[];
}

export class UpdateUserModel extends OmitType(UserModel, [
  'id',
  'connection',
  'user_id',
  'roles',
  'groups',
  'updated_at',
  'signup_at',
  'signup_ip',
  'last_ip',
  'last_login',
  'logins_count',
  'tenant',
  'last_ip',
  'identities',
  'phone_country_code',
]) {}

class PostPermission extends PickType(PermissionModel, [
  'resource_server_identifier',
  'permission_name',
]) {}

export class PostPermissions {
  permissions: PostPermission[];
}
