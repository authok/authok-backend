import { IContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';
import { EmailProviderModel } from './email-provider.model';

export interface IEmailProviderService {
  retrieve(
    ctx: IContext,
    name: string,
  ): Promise<EmailProviderModel | undefined>;

  update(
    ctx: IContext,
    name: string,
    data: EmailProviderModel,
  ): Promise<EmailProviderModel>;

  create(
    ctx: IContext,
    provider: EmailProviderModel,
  ): Promise<EmailProviderModel>;

  delete(ctx: IContext, name: string): Promise<void>;

  paginate(ctx: IContext, query: PageQuery): Promise<Page<EmailProviderModel>>;
}
