import { PageQuery } from "libs/common/src/pagination/pagination.model";


export interface ClientGrantPageQuery extends PageQuery {
  audience?: string | string[];
  client_id?: string | string[];
}