import { IRequestContext } from '@libs/nest-core';
import { EmailTemplateDto } from './email-template.dto';

export interface IMailer {
  send(
    ctx: IRequestContext,
    template: EmailTemplateDto,
    params: Record<string, any>,
    to: string,
  ): Promise<void>;
}
