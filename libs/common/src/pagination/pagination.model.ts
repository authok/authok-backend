export interface PageQuery {
  q?: string;
  page?: number;
  page_size?: number;
  sort?: string;
  include_totals?: boolean;
  include_fields?: boolean;
  [key: string]: any;
}

export interface PageMeta {
  page: number;
  total?: number;
  page_size: number;
}

export class Page<T> {
  items: T[];
  // items: Partial<T>[];
  meta: PageMeta;
}