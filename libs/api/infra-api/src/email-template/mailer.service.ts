import { IContext } from '@libs/nest-core';
import { EmailTemplateModel } from './email-template.model';

export interface IMailer {
  send(
    ctx: IContext,
    template: EmailTemplateModel,
    params: Record<string, any>,
    to: string,
  ): Promise<void>;
}
