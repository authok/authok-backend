import { PageQuery } from "libs/common/src/pagination/pagination.model";

export class GroupModel {
  id: string;
  group_id: string;
  parent_id: string;
  type: string;
  name: string;
  description: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export class GroupPageQuery implements PageQuery {
  type: string;

  parent_id: string;
}