import { Injectable } from '@nestjs/common';
import { URL } from 'url';
import { Request, Response } from 'express';
import { IRequestContext } from '@libs/nest-core';
import axios from 'axios';
import {
  WeworkAccessTokenResult,
  WeworkUserInfo,
  WeworkCheckAccessTokenResult,
} from './models';
import { plainToClass } from 'class-transformer';
import { APIException } from 'libs/common/src/exception/api.exception';
import * as crypto from 'crypto';
import { OAuth2IdentityProvider } from '../../oauth2.identity.provider';
import { AccessTokenResult } from '../../interface';
import { ProfileDataModel } from 'libs/api/infra-api/src';

const AUTHORIZE_URL = 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect';

@Injectable()
export class WeworkIdentityProvider extends OAuth2IdentityProvider {
  buildAuthorizationUrl(
    ctx: IRequestContext,
    req: Request,
    res: Response,
  ): string {
    const state = `${ctx.connection.name}|${crypto
      .randomBytes(32)
      .toString('hex')}`;

    (req as any).session[`${ctx.connection.name}.state`] = state;

    const options = ctx.connection.options;
    const corp_id = options.corp_id as string;
    const agentid = options.agent_id as string;

    const redirect_uri = `https://${req.hostname}/oauth2/callback`;

    const url = new URL(AUTHORIZE_URL);
    url.searchParams.set('appid', corp_id);
    url.searchParams.set('agentid', agentid);
    url.searchParams.set('redirect_uri', redirect_uri);
    url.searchParams.set('state', state);

    console.log('url: ', url);

    return url.href;
  }

  async exchange(
    ctx: IRequestContext,
    code: string,
  ): Promise<AccessTokenResult> {
    const options = ctx.connection.options;
    const corp_id = options.corp_id;
    const corp_secret = options.corp_secret;

    const tokenURL = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken';
    const url = new URL(tokenURL);
    url.searchParams.set('corpid', corp_id);
    url.searchParams.set('corpsecret', corp_secret);

    const r = await axios.get<WeworkAccessTokenResult>(url.href);
    const data = r.data;

    if (data.errcode) {
      throw new APIException(
        'invalid_request',
        `errcode: ${data.errcode}, errmsg: ${data.errmsg}`,
      );
    }

    ctx.openid = r.data.openid;
    ctx.code = code;

    return r.data;
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

    const r = await axios.get<WeworkAccessTokenResult>(url.href);
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
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${access_token}&code=${ctx.code}`;
    const r = await axios.get<any>(url);
    const data = r.data;
    console.log('r.data: ', r.data);

    if (data.errcode) {
      throw new APIException(
        'invalid_request',
        `errcode: ${data.errcode}, errmsg: ${data.errmsg}`,
      );
    }

    const profileUrl = `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${access_token}&userid=${data.UserId}`;

    const { data: profile } = await axios.get<WeworkUserInfo>(profileUrl);
    if (data.errcode) {
      throw new APIException(
        'invalid_request',
        `errcode: ${data.errcode}, errmsg: ${data.errmsg}`,
      );
    }

    console.log('profile: ', profile);

    const { userid, name, gender, telephone, biz_mail, avatar, ...rest } =
      profile;

    return plainToClass(ProfileDataModel, {
      user_id: userid,
      nickname: name,
      gender: parseInt(gender),
      phone_number: telephone,
      email: biz_mail,
      picture: avatar,
      ...rest,
    });
  }

  async checkAccessToken(
    ctx: IRequestContext,
    access_token: string,
    openid: string,
  ) {
    const r = await axios.get<WeworkCheckAccessTokenResult>(
      `https://api.weixin.qq.com/sns/auth?access_token=${access_token}&openid=${openid}`,
    );
    return r.data;
  }
}
