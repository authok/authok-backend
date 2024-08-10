export class ErrorResult {
  errcode: number;
  errmsg: string;
}

export class WeworkAccessTokenResult extends ErrorResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
}

export class WeworkUserInfo extends ErrorResult {
  userid: string;
  name: string;
  department: number[];
  position: string;
  mobile: string;
  gender: string;
  email: string;
  avatar: string;
  status: number;
  isleader: number;
  extattr: { attrs: []; };
  telephone: string;
  enable: number;
  hide_mobile: number;
  order: number[];
  main_department: number;
  qr_code: string;
  alias: string;
  is_leader_in_dept: number[];
  thumb_avatar: string;
  direct_leader: string[];
  biz_mail: string;
}

export class WeworkCheckAccessTokenResult extends ErrorResult {
  
}