import { EmailTemplateDto } from './email-template.dto';
import { IRequestContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';

export interface IEmailTemplateService {
  retrieve(
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
