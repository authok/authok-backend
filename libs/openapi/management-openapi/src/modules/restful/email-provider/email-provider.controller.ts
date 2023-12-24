import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { EmailProviderService } from 'libs/core/infra-core/src/email-provider/email-provider.service';
import { EmailProviderDto, UpdateEmailProviderDto, CreateEmailProviderDto } from 'libs/api/infra-api/src/email-provider/email-provider.dto';
import { IRequestContext } from '@libs/nest-core';

@ApiTags('邮件')
@Controller('emails/provider')
export class EmailController {
  constructor(private readonly emailProviderService: EmailProviderService) {}

  @ApiOperation({ summary: '获取邮件provider', description: '' })
  @Get(':name')
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiOkResponse({
    type: EmailProviderDto,
  })
  retrieve(
    ctx: IRequestContext,
    @Param('name') name: string,  
  ): Promise<EmailProviderDto | null> {
    return this.emailProviderService.retrieve(ctx, name);
  }

  @ApiOperation({ summary: '删除邮件provider', description: '' })
  @Delete(':name')
  delete(
    ctx: IRequestContext,
    @Param('name') name: string,  
  ) {
    return this.emailProviderService.delete(ctx, name);
  }

  @ApiOperation({ summary: '更新邮件provider', description: '' })
  @Patch(':name')
  update(
    ctx: IRequestContext,
    @Param('name') name: string, 
    @Body() data: UpdateEmailProviderDto,
  ) {
    return this.emailProviderService.update(ctx, name, data);
  }

  @ApiOperation({ summary: '创建邮件provider', description: '' })
  @Post()
  create(
    ctx: IRequestContext,
    @Body() provider: CreateEmailProviderDto,
  ) {
    return this.emailProviderService.create(ctx, provider);
  }
}
