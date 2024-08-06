import { PageQuery } from "libs/common/src/pagination/pagination.model";

export class ClientGrantModel {
  id: string;
  client_id: string;
  audience: string;
  scope: string[];
}

export interface ClientGrantPageQuery extends PageQuery {
  audience: string;
  client_id: string;
}

export class PatchClientGrantModel {
  scope: string[];
}
