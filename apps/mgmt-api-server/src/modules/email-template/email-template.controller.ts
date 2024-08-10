import { Controller, Get, Post, Req, Inject, Query, Body, Param, NotFoundException, Patch, Delete, UseGuards } from "@nestjs/common";
import { PageDto } from "libs/common/src/pagination/pagination.dto";
import { ScopesGuard } from "libs/oidc/client/src/lib/guards/scopes.guard";
import { Scopes } from "libs/oidc/client/src/lib/guards/scopes.decorator";
import { IEmailTemplateService } from "libs/api/infra-api/src";
import { EmailTemplateDto, EmailTemplatePageQueryDto } from "libs/dto/src";
import { TenantGuard } from "../../middleware/tenant.guard";
import { IRequestContext, ReqCtx } from "@libs/nest-core";

@Controller('/api/v2/email-templates')
@UseGuards(ScopesGuard)
@UseGuards(TenantGuard)
export class EmailTemplateController {
  constructor(
    @Inject('IEmailTemplateService')
    private readonly emailTemplateService: IEmailTemplateService,
  ) {}

  @Get()
  @Scopes('read:email_templates')
  async paginate(@ReqCtx() ctx: IRequestContext, @Query() query: EmailTemplatePageQueryDto): Promise<PageDto<EmailTemplateDto>> {
    return await this.emailTemplateService.paginate(ctx, query);
  }

  @Post()
  @Scopes('create:email_templates')
  async create(@ReqCtx() ctx: IRequestContext, @Body() organization: EmailTemplateDto): Promise<EmailTemplateDto> {
    return await this.emailTemplateService.create(ctx, organization);
  }

  @Get(':template')
  @Scopes('read:email_templates')
  async retrieve(@ReqCtx() ctx: IRequestContext, @Param('template') template: string): Promise<EmailTemplateDto | undefined> {
    const client = await this.emailTemplateService.retrieve(ctx, template);
    if (!client) throw new NotFoundException();

    return client;
  }

  @Patch(':template')
  @Scopes('update:email_templates')
  async update(@ReqCtx() ctx: IRequestContext, @Param('template') id: string, @Body() data: EmailTemplateDto) {
    return await this.emailTemplateService.update(ctx, id, data);
  }

  @Delete(':template')
  @Scopes('delete:email_templates')
  async delete(@ReqCtx() ctx: IRequestContext, @Param('template') template: string): Promise<void> {
    await this.emailTemplateService.delete(ctx, template);
  }
}