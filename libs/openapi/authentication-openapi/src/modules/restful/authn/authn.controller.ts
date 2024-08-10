import {
  Controller,
  Post,
  Res,
  Req,
  Get,
  NotFoundException,
  Query,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { TriggerInterceptor } from './trigger.interceptor';

@ApiTags('认证')
@Controller()
export class AuthnController {
  constructor() {}

  @Get('/authorize/:uid')
  @UseInterceptors(TriggerInterceptor)
  async resume(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const provider = await ctx.currentProvider();
    if (!provider) {
      throw new NotFoundException();
    }

    const callback = provider.callback();
    await callback(req, res);
  }

  @Get('/authorize*')
  @ApiQuery({
    name: 'response_type',
    required: true,
    description: '如果是服务端流程设置为 code, 如果是应用端流程则设置为 token',
  })
  @ApiQuery({
    name: 'redirect_uri',
    required: true,
    description: '在用户认证成功后, Authok 会把浏览器重定向到此 URL.',
  })
  @ApiQuery({
    name: 'state',
    description:
      '应用在初始请求服务端时填入的透传值，重定向时会携带回来. 在应用中使用此值可以防止 CSRF 攻击.',
  })
  @ApiQuery({
    name: 'connection',
    description:
      '如果是社交登录，则为你应用所配置的社交身份提供者名称, 例如 google-oauth2 或 facebook. 如果设置为空, 将会被重定向到 Authok 登录页并显示 Login Widget.',
  })
  @ApiQuery({
    name: 'scope',
    description:
      'OIDC scopes 和自定义的 API scopes. 例如: openid read:timesheets.',
  })
  @UseInterceptors(TriggerInterceptor)
  async authorize(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const provider = await ctx.currentProvider();
    if (!provider) {
      throw new NotFoundException();
    }

    const callback = provider.callback();
    await callback(req, res);
  }

  @Get('/v2/logout')
  @ApiQuery({
    name: 'return_to',
    description: '',
  })
  @ApiQuery({
    name: 'client_id',
    description: '',
  })
  @ApiQuery({
    name: 'federated',
    description: '',
  })
  @ApiQuery({
    name: 'id_token_hint',
    description: '',
  })
  async logout(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
    @Query('return_to') return_to: string,
    @Query('returnTo') returnTo: string,
    @Query('post_logout_redirect_uri') post_logout_redirect_uri: string,
    @Query('client_id') client_id: string,
    @Query('id_token_hint') id_token_hint: string,
    @Query('federated') federated: boolean,
  ) {
    const provider = await ctx.currentProvider();
    if (!provider) throw new NotFoundException('provider not found');

    return_to = return_to || returnTo;

    let url = '/v2/logout?';
    if (id_token_hint) {
      url += 'id_token_hint=' + id_token_hint;
    } else if (client_id) {
      url += 'client_id=' + client_id;
    }

    if (post_logout_redirect_uri) {
      url +=
        '&post_logout_redirect_uri=' +
        encodeURIComponent(post_logout_redirect_uri);
    } else if (return_to) {
      url += '&post_logout_redirect_uri=' + encodeURIComponent(return_to);
    }
    if (federated) {
      url += '&federated=' + federated;
    }

    Logger.debug(`logout url: ${url}`);

    req.url = url;
    req.originalUrl = url;

    const callback = provider.callback();
    await callback(req, res);
  }

  @Post('/v2/logout/confirm')
  async logoutConfirm(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    Logger.debug('logout_confirm xxx');

    const provider = await ctx.currentProvider();
    if (!provider) throw new NotFoundException('provider not found');
    const callback = provider.callback();
    await callback(req, res);
  }

  @Get('/v2/logout/success')
  async logoutSuccess(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    Logger.debug('logout_success xxx');

    const provider = await ctx.currentProvider();
    if (!provider) throw new NotFoundException('provider not found');
    const callback = provider.callback();
    await callback(req, res);
  }
}
