import { PageQuery } from 'libs/common/src/pagination/pagination.model';

export class EmailTemplateModel {
  template: string;
  body: string;
  from: string;
  result_url: string;
  subject: string;
  syntax: string;
  url_lifetime_in_seconds: number;
  include_email_in_redirect: boolean;
  enabled: boolean;
}

export interface EmailTemplatePageQuery extends PageQuery {
  template: string | string[];
}