export interface PageQuery {
  q?: string;
  page?: number;
  per_page?: number;
  sort?: string;
  include_totals?: boolean;
  include_fields?: boolean;
  [key: string]: any;
}

export interface PageMeta {
  page: number;
  total?: number;
  per_page: number;
}

export class Page<T> {
  items: T[];
  // items: Partial<T>[];
  meta: PageMeta;
}