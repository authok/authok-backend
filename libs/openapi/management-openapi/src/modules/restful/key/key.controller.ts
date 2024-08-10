import {
  Controller,
  Body,
  Get,
  UseGuards,
  Post,
  Param,
  Put,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { ScopesGuard } from 'libs/oidc/client/src/lib/guards/scopes.guard';
import { Scopes } from 'libs/oidc/client/src/lib/guards/scopes.decorator';
import { KeyDto } from 'libs/dto/src';
import { IKeyService } from 'libs/api/infra-api/src';
import { ReqCtx, IRequestContext } from '@libs/nest-core';
import { AuthGuard } from '@nestjs/passport';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('/api/v2/keys')
@ApiTags('密钥 - API')
@Throttle({
  default: {
    limit: 3,
    ttl: 1000,
  }
})
@UseGuards(ThrottlerGuard, AuthGuard('jwt'), ScopesGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: '未授权' })
@ApiForbiddenResponse({ description: '权限不足' })
export class KeyController {
  constructor(
    @Inject('IKeyService')
    private readonly keyService: IKeyService,
  ) {}

  @Get('signing')
  @ApiOperation({
    summary: '获得当前所有签名密钥.',
  })
  @Scopes('read:signing_keys')
  async signing(
    @ReqCtx() ctx: IRequestContext,
  ): Promise<KeyDto[]> {    
    return await this.keyService.findAll(ctx);
  }

  @Get('signing/:id')
  @ApiOperation({
    summary: '获取给定的签名密钥.',
  })
  @Scopes('read:signing_keys')
  async getSigningKey(@Param('id') id: string): Promise<KeyDto> {
    // TODO
    return null;
  }

  @Post('rotate')
  @ApiOperation({
    summary: '轮换签名密钥. 返回的是next的key',
  })
  @Scopes('create:signing_keys', 'update:signing_keys')
  async rotate(
    @ReqCtx() ctx: IRequestContext,
  ): Promise<KeyDto> {
    return await this.keyService.rotate(ctx);
  }

  @Put('signing/:kid/revoke')
  @ApiOperation({
    summary: '根据 kid 撤销签名密钥',
  })
  @Scopes('update:signing_keys')
  async revoke(@Param('id') id: string): Promise<KeyDto> {
    // TODO
    return null;
  }
}
