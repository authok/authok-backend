import { OAuth2IdentityProvider } from '../../oauth2.identity.provider';
import { Injectable, Logger } from '@nestjs/common';
import { URL } from 'url';
import { Request, Response } from 'express';
import { IRequestContext } from '@libs/nest-core';
import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { APIException } from 'libs/common/src/exception/api.exception';
import * as crypto from 'crypto';
import dayjs from 'dayjs';
import { AccessTokenResult } from '../../interface';
import { ProfileDataModel } from 'libs/api/infra-api/src';

const AUTHORIZE_URL = 'https://fuwu.jinritemai.com/authorize';
const TOKEN_URL = 'https://openapi-fxg.jinritemai.com/token/create';
const REFRESH_TOKEN_URL = 'https://openapi-fxg.jinritemai.com/token/refresh';

// 参考: https://op.jinritemai.com/docs/guide-docs/9/22
@Injectable()
export class DoudianIdentityProvider extends OAuth2IdentityProvider {
  buildAuthorizationUrl(
    ctx: IRequestContext,
    req: Request,
    res: Response,
  ): string {
    const options = ctx.connection.options;
    const service_id = options.service_id as string;

    const state = `${req.query.client_id}|${ctx.connection.name}|${crypto
      .randomBytes(32)
      .toString('hex')}`;

    /* TODO 这个 state 存放在 interaction 中会更好, 但目前 interaction 的 params 参数貌似会被 oidc-provider chech, 其它字段貌似没有能动态扩展的
      interaction.result.state = state;
      interaction.save(_ctx, Math.floor(Date.now() / 1000));
    */
    (req as any).session[`${ctx.connection.name}.state`] = state;

    // const redirect_uri = `https://${req.hostname}/login/callback/federated`;

    const url = new URL(AUTHORIZE_URL);
    url.searchParams.set('service_id', service_id);
    // url.searchParams.set('redirect_uri', redirect_uri);
    url.searchParams.set('state', state);

    console.log('url: ', url);

    return url.href;
  }

  async exchange(
    ctx: IRequestContext,
    code: string,
  ): Promise<AccessTokenResult> {
    const options = ctx.connection.options;
    const app_key = options.app_key;
    const app_secret = options.app_secret;

    const method = 'token.create';
    const timestamp = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const params = { code, grant_type: 'authorization_code' };
    const sign = this.create_sign(
      app_secret,
      app_key,
      method,
      JSON.stringify(params),
      timestamp,
    );

    const url = new URL(TOKEN_URL);
    url.searchParams.set('app_key', app_key);
    url.searchParams.set('method', method);
    url.searchParams.set('timestamp', timestamp);
    url.searchParams.set('v', '2');
    url.searchParams.set('sign', sign);

    const r = await axios.post(url.href, params);
    const result = r.data;
    if (result.code != 10000) {
      console.error('fetch token error', r.data);
      throw new APIException(
        'invalid_request',
        `fetch token error, sub_code: ${r.data.sub_code}, sub_msg: ${r.data.sub_msg}`,
      );
    }

    ctx.data = result.data;
    Logger.debug('doudian.exchange', result.data);

    return result.data;
  }

  create_sign(
    app_secret: string,
    app_key: string,
    method: string,
    param_json: string,
    timestamp: string,
  ): string {
    const str =
      app_secret +
      'app_key' +
      app_key +
      'method' +
      method +
      'param_json' +
      param_json +
      'timestamp' +
      timestamp +
      'v2' +
      app_secret;
    const md5 = crypto.createHash('md5');
    // TODO 要过滤掉 str 中的特殊字符
    md5.update(str);
    const sign = md5.digest('hex');
    console.log('md5: ', sign);
    return sign;
  }

  async refreshAccessToken(
    ctx: IRequestContext,
    refresh_token: string,
  ): Promise<AccessTokenResult> {
    const options = ctx.connection.options;
    const app_secret = options.app_secret;
    const app_key = options.app_key;

    const method = 'token.refresh';
    const timestamp = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const param_json = JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    });
    const sign = this.create_sign(
      app_secret,
      app_key,
      method,
      param_json,
      timestamp,
    );

    const url = new URL(REFRESH_TOKEN_URL);
    url.searchParams.set('app_key', app_key);
    url.searchParams.set('method', method);
    url.searchParams.set('param_json', param_json);
    url.searchParams.set('timestamp', timestamp);
    url.searchParams.set('sign', sign);
    console.log('url: ', url.href);

    const r = await axios.get(url.href);
    return r.data;
  }

  async fetchUserInfo(
    ctx: IRequestContext,
    access_token: string,
  ): Promise<ProfileDataModel> {
    const { shop_id: user_id, shop_name: nickname, ...rest } = ctx.data;

    return plainToClass(ProfileDataModel, {
      ...rest,
      user_id,
      openid: user_id,
      nickname,
    });
  }
}
