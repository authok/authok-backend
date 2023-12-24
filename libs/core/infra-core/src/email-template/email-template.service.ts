import { Inject, Injectable } from '@nestjs/common';
import { EmailTemplateDto } from 'libs/api/infra-api/src/email-template/email-template.dto';
import { IEmailTemplateRepository } from 'libs/api/infra-api/src/email-template/email-template.repository';
import { IEmailTemplateService } from 'libs/api/infra-api/src/email-template/email-template.service';
import { IRequestContext } from '@libs/nest-core';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';

@Injectable()
export class EmailTemplateService implements IEmailTemplateService {
  constructor(
    @Inject('IEmailTemplateRepository')
    private readonly emailTemplateRepository: IEmailTemplateRepository,
  ) {}

  async retrieve(
    ctx: IRequestContext,
    template: string,
  ): Promise<EmailTemplateDto | undefined> {
    return await this.emailTemplateRepository.findByName(ctx, template);
  }

  async update(
    ctx: IRequestContext,
    template: string,
    data: EmailTemplateDto,
  ): Promise<EmailTemplateDto> {
    return await this.emailTemplateRepository.update(ctx, template, data);
  }

  async create(
    ctx: IRequestContext,
    template: EmailTemplateDto,
  ): Promise<EmailTemplateDto> {
    return await this.emailTemplateRepository.create(ctx, template);
  }

  async delete(ctx: IRequestContext, template: string): Promise<void> {
    return await this.emailTemplateRepository.delete(ctx, template);
  }

  async paginate(ctx: IRequestContext, query: PageQuery): Promise<Page<EmailTemplateDto>> {
    return await this.emailTemplateRepository.paginate(ctx, query);
  }
}
