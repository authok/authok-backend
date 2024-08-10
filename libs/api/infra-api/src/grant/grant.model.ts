import { PageQuery } from "libs/common/src/pagination/pagination.model";

export class GrantModel {
  id: string;
  user_id: string;
  client_id: string;
  resources: Record<string, any>;
  openid: any;
  rejected: any;
  data: any;
  iat: number;
  exp: number;
  updated_at: Date;
  created_at: Date;
}

export interface GrantPageQuery extends PageQuery {
  user_id?: string;
  client_id?: string;
  audience?: string;
}