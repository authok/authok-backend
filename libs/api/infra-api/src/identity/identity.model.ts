import { OmitType } from "@nestjs/swagger";

export class ProfileDataModel {
  user_id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  username: string;
  given_name: string;
  phone_number: string;
  phone_number_verified: boolean;
  family_name: string;
  picture: string;
  city: string;
  province: string;
  country: string;
  gender: number;
  nickname: string;
  openid: string;
  unionid: string;
  [key: string]: any;
}

export class IdentityModel {
  id: string;
  connection: string;
  user_id: string;
  provider: string;
  is_social: boolean;
  access_token?: string;
  expires_in: number;
  refresh_token?: string;
  profile_data?: ProfileDataModel;
  last_login: Date;
  updated_at: Date;
  created_at: Date;
}

export class CreateIdentityModel extends OmitType(IdentityModel, [
  'id',
  'provider',
  'last_login',
  'updated_at',
  'created_at',
  'profile_data',
]) {
  profile_data: Partial<ProfileDataModel>;
}

export class LinkIdentityReq {
  provider?: string;
  connection?: string;
  user_id?: string;
  link_with?: string;
}
