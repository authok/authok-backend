import { Inject, Injectable } from '@nestjs/common';
import { IEmailTemplateRepository, IEmailTemplateService } from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination';
import { EmailTemplateModel } from 'libs/api/infra-api/src';

@Injectable()
export class EmailTemplateService implements IEmailTemplateService {
  constructor(
    @Inject('IEmailTemplateRepository')
    private readonly emailTemplateRepository: IEmailTemplateRepository,
  ) {}

  async retrieve(
    ctx: IContext,
    template: string,
  ): Promise<EmailTemplateModel | undefined> {
    return await this.emailTemplateRepository.findByName(ctx, template);
  }

  async update(
    ctx: IContext,
    template: string,
    data: EmailTemplateModel,
  ): Promise<EmailTemplateModel> {
    return await this.emailTemplateRepository.update(ctx, template, data);
  }

  async create(
    ctx: IContext,
    template: EmailTemplateModel,
  ): Promise<EmailTemplateModel> {
    return await this.emailTemplateRepository.create(ctx, template);
  }

  async delete(ctx: IContext, template: string): Promise<void> {
    return await this.emailTemplateRepository.delete(ctx, template);
  }

  async paginate(ctx: IContext, query: PageQuery): Promise<Page<EmailTemplateModel>> {
    return await this.emailTemplateRepository.paginate(ctx, query);
  }
}