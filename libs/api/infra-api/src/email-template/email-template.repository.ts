import { EmailTemplateModel } from './email-template.model';
import { IContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination';

export interface IEmailTemplateRepository {
  findByName(
    ctx: IContext,
    template: string,
  ): Promise<EmailTemplateModel | undefined>;

  update(
    ctx: IContext,
    template: string,
    data: EmailTemplateModel,
  ): Promise<EmailTemplateModel>;

  create(
    ctx: IContext,
    template: EmailTemplateModel,
  ): Promise<EmailTemplateModel>;

  delete(ctx: IContext, template: string): Promise<void>;

  paginate(ctx: IContext, query: PageQuery): Promise<Page<EmailTemplateModel>>;
}
