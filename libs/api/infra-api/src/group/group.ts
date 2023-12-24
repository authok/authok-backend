export interface IGroup {
  // 全局 guid
  id: string;

  // 租户唯一的id
  group_id: string;

  type: string;

  name: string;
  
  description: string;
  
  parent_id?: string;

  outer_id: string;

  order: number;

  created_at: Date;

  updated_at: Date;
}