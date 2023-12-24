import { Injectable } from '@nestjs/common';
import { IEmailProviderService } from 'libs/api/infra-api/src/email-provider/email-provider.service';
import { IRequestContext } from '@libs/nest-core';
import { EmailProviderDto } from 'libs/api/infra-api/src/email-provider/email-provider.dto';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';
import { ConfigResourceService } from '../config/config-resource.service';

@Injectable()
export class EmailProviderService extends ConfigResourceService<EmailProviderDto> implements IEmailProviderService {
  constructor() {
    super('email-provider');
  }

  async retrieve(
    ctx: IRequestContext,
    name: string,
  ): Promise<EmailProviderDto | undefined> {
    return await super.get(ctx, name);
  }

  async update(
    ctx: IRequestContext,
    name: string,
    data: EmailProviderDto,
  ): Promise<EmailProviderDto> {
      return await super.set(ctx, name, data);
  }

  async create(
    ctx: IRequestContext,
    provider: EmailProviderDto,
  ): Promise<EmailProviderDto> {
    return await super.set(ctx, provider.name, provider);
  }

  async delete(ctx: IRequestContext, name: string): Promise<void> {
    return await super.delete(ctx, name);
  }

  async paginate(ctx: IRequestContext, query: PageQuery): Promise<Page<EmailProviderDto>> {
    return await super.paginate(ctx, query);
  }
}