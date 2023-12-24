export interface WeworkBaseResponse {
	errcode: number;
	errmsg: string;
}

export interface WeworkToken extends WeworkBaseResponse {
	access_token: string;
	expires_in: number;
}

export interface WeworkDeptList extends WeworkBaseResponse {
  department: WeworkDeptInfo[];
}

export interface WeworkDeptInfo {
  id: number;
  name: string;
  dn: string;
  parentid: number;
}

export interface WeworkUserList extends WeworkBaseResponse {
	userlist: WeworkUserInfo[];
}

export interface WeworkUserInfo {
  userid: string;
  name: string;
  department: number[];
  position: string;
  main_department: number;
  mobile: string;
  gender: string;
  email: string;
  avatar: string;
  status: number;
  enable: number;
  isleader: number;
  extattr: Record<string, any>; // { attrs: [] },
  hide_mobile: number; // 0,
  telephone: number; // '',
  order: number[]; // [ 0 ],
  qr_code: string; // 'https://open.work.weixin.qq.com/wwopen/userQRCode?vcode=vc5a11b4224813b779',
  alias: string;
  is_leader_in_dept: number[]; // [ 0 ],
  address: string; // '',
  thumb_avatar: string; // '',
  direct_leader: string[]; // [],
  biz_mail: string; // 'zhilan@lucfish.com'
}