export interface Node<T> {
  id: string | number;
  type: string;
  name: string;
  keywords: string[];
  parent_id: string;
  data?: T;
}