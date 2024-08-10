import {
  Controller,
  UseGuards,
  Post,
  Body,
  Delete,
  Get,
  Param,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { EmailTemplateDto } from 'libs/dto/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { IEmailTemplateService } from 'libs/api/infra-api/src';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';

@ApiTags('邮件模版')
@Controller('/api/v2/email-templates')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiBearerAuth()
@ApiTags('授权')
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class EmailTemplateController {
  constructor(
    @Inject('IEmailTemplateService')
    private readonly emailTemplateService: IEmailTemplateService,
  ) {}

  @ApiOperation({ summary: '获取邮件模版', description: '' })
  @Get(':templateName')
  async retrieve(
    @ReqCtx() ctx: IRequestContext,
    @Param('templateName') templateName: string,
  ): Promise<EmailTemplateDto | null> {
    return await this.emailTemplateService.retrieve(ctx, templateName);
  }

  @ApiOperation({ summary: '删除邮件模版' })
  @Scopes('delete:email_templates')
  @Delete(':templateName')
  delete(
    @ReqCtx() ctx: IRequestContext,
    @Param('templateName') templateName: string,
  ) {
    return this.emailTemplateService.delete(ctx, templateName);
  }

  @ApiOperation({ summary: '创建邮件模版' })
  @Scopes('create:email_templates')
  @Post()
  create(@ReqCtx() ctx: IRequestContext, @Body() input: EmailTemplateDto) {
    return this.emailTemplateService.create(ctx, input);
  }
}
