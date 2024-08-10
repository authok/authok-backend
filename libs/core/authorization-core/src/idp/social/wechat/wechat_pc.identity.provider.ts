import { OAuth2IdentityProvider } from '../../oauth2.identity.provider';
import { Injectable, Logger } from '@nestjs/common';
import { URL } from 'url';
import { Request, Response } from 'express';
import { IRequestContext } from '@libs/nest-core';
import axios from 'axios';
import {
  WechatAccessTokenResult,
  WechatUserInfo,
  WechatCheckAccessTokenResult,
} from './types';
import { ProfileDataModel } from 'libs/api/infra-api/src';
import { plainToClass } from 'class-transformer';
import { APIException } from 'libs/common/src/exception/api.exception';
import * as crypto from 'crypto';
import { AccessTokenResult } from '../../interface';

const AUTHORIZE_URL = 'https://open.weixin.qq.com/connect/qrconnect';

// 微信登录参考: https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html#1

// 参考: https://github.com/zeronejs/zerone/blob/c3391f771887f6f44a64685d3aac7453cd526e77/packages/wechat/login/src/oauth2/oauth2.service.ts
@Injectable()
export class WechatPCIdentityProvider extends OAuth2IdentityProvider {
  buildAuthorizationUrl(
    ctx: IRequestContext,
    req: Request,
    res: Response,
  ): string {
    const options = ctx.connection.options;
    const app_id = options.app_id as string;

    let scope = req.query.connection_scope;
    if (!scope && options.scopes) {
      if (typeof options.scopes === 'string') {
        scope = options.scopes as string;
      } else {
        scope = Object.keys(options.scopes).join(' ');
      }
    } else {
      scope = 'snsapi_login';
    }

    const state = `${ctx.connection.name}|${crypto
      .randomBytes(32)
      .toString('hex')}`;
    const nonce = crypto.randomBytes(32).toString('hex');

    (req as any).session[`${ctx.connection.name}.state`] = state;
    (req as any).session[`${ctx.connection.name}.nonce`] = nonce;

    const redirect_uri = `https://${req.hostname}/login/callback/federated`;

    const url = new URL(AUTHORIZE_URL);
    url.searchParams.set('appid', app_id);
    url.searchParams.set('redirect_uri', redirect_uri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', scope);
    url.searchParams.set('state', state);
    url.searchParams.set('nonce', nonce);
    url.hash = 'wechat_redirect';

    Logger.debug(`跳转到 微信PC的 授权端点: ${url.href}`);

    return url.href;
  }

  async exchange(
    ctx: IRequestContext,
    code: string,
  ): Promise<AccessTokenResult> {
    const options = ctx.connection.options;
    const app_id = options.app_id;
    const secret = options.app_secret;

    const tokenURL = 'https://api.weixin.qq.com/sns/oauth2/access_token';
    const url = new URL(tokenURL);
    url.searchParams.set('appid', app_id);
    url.searchParams.set('secret', secret);
    url.searchParams.set('code', code);
    url.searchParams.set('grant_type', 'authorization_code');

    const r = await axios.get<WechatAccessTokenResult>(url.href);
    const data = r.data;

    if (data.errcode) {
      throw new APIException(
        'invalid_request',
        `errcode: ${data.errcode}, errmsg: ${data.errmsg}`,
      );
    }

    ctx.openid = r.data.openid;
    return data;
  }

  async refreshAccessToken(ctx: IRequestContext, refresh_token: string) {
    const options = ctx.connection.options;
    const app_id = options.app_id;

    const refreshTokenURL =
      'https://api.weixin.qq.com/sns/oauth2/refresh_token';
    const url = new URL(refreshTokenURL);
    url.searchParams.set('appid', app_id);
    url.searchParams.set('refresh_token', refresh_token);
    url.searchParams.set('grant_type', 'refresh_token');

    const r = await axios.get<WechatAccessTokenResult>(url.href);
    const data = r.data;
    if (data.errcode) {
      throw new APIException(
        'invalid_request',
        `errcode: ${data.errcode}, errmsg: ${data.errmsg}`,
      );
    }
    return r;
  }

  async fetchUserInfo(
    ctx: IRequestContext,
    access_token: string,
  ): Promise<ProfileDataModel> {
    const lang = 'zh_CN';
    const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${ctx.openid}&lang=${lang}`;
    console.log('url: ', url);
    const r = await axios.get<WechatUserInfo>(url);
    const data = r.data;
    if (data.errcode) {
      throw new APIException(
        'invalid_request',
        `errcode: ${data.errcode}, errmsg: ${data.errmsg}`,
      );
    }

    const {
      unionid,
      openid,
      nickname,
      sex: gender,
      city,
      headimgurl: picture,
      ...rest
    } = data;

    return plainToClass(ProfileDataModel, {
      ...rest,
      user_id: unionid || openid,
      openid,
      nickname,
      gender,
      city,
      unionid: data.unionid,
      picture,
    });
  }

  async checkAccessToken(
    ctx: IRequestContext,
    access_token: string,
    openid: string,
  ) {
    const r = await axios.get<WechatCheckAccessTokenResult>(
      `https://api.weixin.qq.com/sns/auth?access_token=${access_token}&openid=${openid}`,
    );
    const data = r.data;
    if (data.errcode) {
      throw new APIException(
        'invalid_request',
        `errcode: ${data.errcode}, errmsg: ${data.errmsg}`,
      );
    }

    return data;
  }
}
