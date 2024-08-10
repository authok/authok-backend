import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailTemplateModel, IEmailTemplateRepository } from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { EmailTemplateEntity } from './email-template.entity';
import { paginate } from 'libs/common/src/pagination/typeorm-paginate';
import { PageQuery, Page } from 'libs/common/src/pagination';

@Injectable()
export class TypeOrmEmailTemplateRepository
  extends TenantAwareRepository
  implements IEmailTemplateRepository {

  async findByName(
    ctx: IContext,
    template: string,
  ): Promise<EmailTemplateModel | undefined> {
    const repo = await this.repo(ctx, EmailTemplateEntity);
    return repo.findOne({
      where: {
        tenant: ctx.tenant,
        template,
      }
    });
  }

  async update(
    ctx: IContext,
    template: string,
    data: EmailTemplateModel,
  ): Promise<EmailTemplateModel> {
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
    ctx: IContext,
    emailTemplate: EmailTemplateModel,
  ): Promise<EmailTemplateModel> {
    const repo = await this.repo(ctx, EmailTemplateEntity);
    
    const entity = repo.create(emailTemplate);
    entity.tenant = ctx.tenant;
  
    return repo.save(entity);
  }

  async delete(ctx: IContext, template: string): Promise<void> {
    const repo = await this.repo(ctx, EmailTemplateEntity);
    await repo.delete({
      tenant: ctx.tenant,
      template,
    });
  }

  async paginate(ctx: IContext, query: PageQuery): Promise<Page<EmailTemplateModel>> {
    const repo = await this.repo(ctx, EmailTemplateEntity);
    
    query.tenant = ctx.tenant;
    const page = await paginate(repo, query, ['template']);

    return {
      items: page.items,
      meta: page.meta,
    }
  }
}
