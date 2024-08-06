import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailTemplateDto } from 'libs/api/infra-api/src/email-template/email-template.dto';
import { IEmailTemplateRepository } from 'libs/api/infra-api/src/email-template/email-template.repository';
import { IRequestContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { EmailTemplateEntity } from './email-template.entity';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { PageQuery, Page } from 'libs/common/src/pagination/pagination.model';

@Injectable()
export class TypeOrmEmailTemplateRepository
  extends TenantAwareRepository
  implements IEmailTemplateRepository {

  async findByName(
    ctx: IRequestContext,
    template: string,
  ): Promise<EmailTemplateDto | undefined> {
    const repo = await this.repo(ctx, EmailTemplateEntity);
    return repo.findOne({
      where: {
        tenant: ctx.tenant,
        template,
      }
    });
  }

  async update(
    ctx: IRequestContext,
    template: string,
    data: EmailTemplateDto,
  ): Promise<EmailTemplateDto> {
    const repo = await this.repo(ctx, EmailTemplateEntity);
    const { affected } = await repo.update(
      {
        tenant: ctx.tenant,
        template,
      },
      data,
    );

    if (!affected) {
      throw new NotFoundException(`EmailTemplate ${ctx.tenant} ${template} not found`);
    }

    return await repo.findOne({
      where: {
        tenant: ctx.tenant,
        template,
      },
    });
  }

  async create(
    ctx: IRequestContext,
    emailTemplate: EmailTemplateDto,
  ): Promise<EmailTemplateDto> {
    const repo = await this.repo(ctx, EmailTemplateEntity);
    
    const entity = repo.create(emailTemplate);
    entity.tenant = ctx.tenant;
  
    return repo.save(entity);
  }

  async delete(ctx: IRequestContext, template: string): Promise<void> {
    const repo = await this.repo(ctx, EmailTemplateEntity);
    await repo.delete({
      tenant: ctx.tenant,
      template,
    });
  }

  async paginate(ctx: IRequestContext, query: PageQuery): Promise<Page<EmailTemplateDto>> {
    const repo = await this.repo(ctx, EmailTemplateEntity);
    
    query.tenant = ctx.tenant;
    const page = await paginate(repo, query, ['template']);

    return {
      items: page.items,
      meta: page.meta,
    }
  }
}
