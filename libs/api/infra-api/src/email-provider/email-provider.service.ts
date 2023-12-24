import { IRequestContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';
import { EmailProviderDto } from './email-provider.dto';

export interface IEmailProviderService {
  retrieve(
    ctx: IRequestContext,
    name: string,
  ): Promise<EmailProviderDto | undefined>;

  update(
    ctx: IRequestContext,
    name: string,
    data: EmailProviderDto,
  ): Promise<EmailProviderDto>;

  create(
    ctx: IRequestContext,
    provider: EmailProviderDto,
  ): Promise<EmailProviderDto>;

  delete(ctx: IRequestContext, name: string): Promise<void>;

  paginate(ctx: IRequestContext, query: PageQuery): Promise<Page<EmailProviderDto>>;
}
