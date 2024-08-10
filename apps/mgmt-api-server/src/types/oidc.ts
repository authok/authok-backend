export interface IUser {
  org_id: string;
  sub: string;
}

export interface OIDCRequest {
  user: IUser;

  [key: string]: any;
}