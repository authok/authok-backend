export class ErrorResult {
  errcode: number;
  errmsg: string;
}

export class WechatAccessTokenResult extends ErrorResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
}

export class WechatUserInfo extends ErrorResult {
  openid: string;
  nickname: string;
  sex: number;
  language: string;
  city: string;
  province: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid: string;
}

export class WechatCheckAccessTokenResult extends ErrorResult {
  
}