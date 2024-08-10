import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Res,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { OAuthService } from './oauth.service';

import { GetDeviceCodeRes, GetDeviceCodeReq } from './oauth.dto';
import { Request, Response } from 'express';
import { 
  IUserService,
  IConnectionService,
} from 'libs/api/infra-api/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { IAuthorizationManager } from 'libs/api/authorization-api/src/authorization.manager';

@ApiTags('OAuth')
@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IAuthorizationManager')
    private readonly authorizationManager: IAuthorizationManager,
  ) {}

  @Post('device/code')
  @ApiOperation({ summary: '获取设备代码' })
  async verify(
    @Body() req: GetDeviceCodeReq,
  ): Promise<GetDeviceCodeRes | undefined> {
    // TODO
    return null;
  }

  async auth(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const provider = await ctx.currentProvider();
    if (!provider) {
      throw new NotFoundException('tenant not found');
    }

    const callback = provider.callback();
    return await callback(req, res);
  }

  @Post('token')
  @ApiOperation({ summary: '通过 code 获取 access_token' })
  async token(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const provider = await ctx.currentProvider();
    if (!provider) {
      throw new NotFoundException('tenant not found');
    }

    console.log('token 请求参数: ', req.path, req.body, req.query, req.headers);
    const callback = provider.callback();
    return await callback(req, res);
  }

  @Post('revoke')
  revoke(@Req() req: Request) {
    const { clientId, client_secret, token } = req.body;
  }

  foo(@Query('code') code: string, @Query('state') state: string): string {
    const result = { code, state };

    return `
    <!DOCTYPE html>
    <html lang="zh">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>处理中</title>
    </head>
    
    <body>
      <script>
        var father = window.opener
        father.postMessage(${JSON.stringify(result)}, "*")
        // window.close()
      </script>
    </body>
    
    </html>`;
  }
}
