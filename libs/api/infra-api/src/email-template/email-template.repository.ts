import { EmailTemplateDto } from './email-template.dto';
import { IRequestContext } from '@libs/nest-core';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

export interface IEmailTemplateRepository {
  findByName(
    ctx: IRequestContext,
    template: string,
  ): Promise<EmailTemplateDto | undefined>;

  update(
    ctx: IRequestContext,
    template: string,
    data: EmailTemplateDto,
  ): Promise<EmailTemplateDto>;

  create(
    ctx: IRequestContext,
    template: EmailTemplateDto,
  ): Promise<EmailTemplateDto>;

  delete(ctx: IRequestContext, template: string): Promise<void>;

  paginate(ctx: IRequestContext, query: PageQuery): Promise<Page<EmailTemplateDto>>;
}
