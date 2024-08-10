import { Injectable } from '@nestjs/common';
import { IContext } from '@libs/nest-core';
import { 
  IEmailProviderService,
  EmailProviderModel,
} from 'libs/api/infra-api/src';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';
import { ConfigResourceService } from '../config/config-resource.service';

@Injectable()
export class EmailProviderService extends ConfigResourceService<EmailProviderModel> implements IEmailProviderService {
  constructor() {
    super('email-provider');
  }

  async retrieve(
    ctx: IContext,
    name: string,
  ): Promise<EmailProviderModel | undefined> {
    return await super.get(ctx, name);
  }

  async update(
    ctx: IContext,
    name: string,
    data: EmailProviderModel,
  ): Promise<EmailProviderModel> {
      return await super.set(ctx, name, data);
  }

  async create(
    ctx: IContext,
    provider: EmailProviderModel,
  ): Promise<EmailProviderModel> {
    return await super.set(ctx, provider.name, provider);
  }

  async delete(ctx: IContext, name: string): Promise<void> {
    return await super.delete(ctx, name);
  }

  async paginate(ctx: IContext, query: PageQuery): Promise<Page<EmailProviderModel>> {
    return await super.paginate(ctx, query);
  }
}