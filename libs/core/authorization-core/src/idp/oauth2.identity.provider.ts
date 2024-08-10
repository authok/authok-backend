import { Inject, Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { IRequestContext } from '@libs/nest-core';
import {
  TokenExchangeFn,
  FetchUserProfileFn,
} from 'libs/api/authorization-api/src/types';
import * as _ from 'lodash';
import { URL } from 'url';
import { IAuthorizationHandler } from 'libs/api/authorization-api/src/authorization.handler';
import { AccessTokenResult } from './interface';
import { ISandboxService } from 'libs/api/sandbox-api/src/sandbox.service';
import { ProfileDataModel } from 'libs/api/infra-api/src';

@Injectable()
export class OAuth2IdentityProvider implements IAuthorizationHandler {
  @Inject('ISandboxService')
  private readonly sandboxService: ISandboxService;

  async authorize(
    ctx: IRequestContext,
    req: Request,
    res: Response,
  ): Promise<void> {
    const authorizationUrl = this.buildAuthorizationUrl(ctx, req, res);

    res.redirect(authorizationUrl);
  }

  buildAuthorizationUrl(
    ctx: IRequestContext,
    req: Request,
    res: Response,
  ): string {
    const options = ctx.connection.options;
    const authorizationURL = options.authorizationURL as string;
    const client_id = options.client_id as string;
    const scope = (req.query.connection_scope as string) || options.scope;
    const state = req.query.state as string;

    const redirect_uri = `${req.hostname}/login/callback`;

    const url = new URL(authorizationURL);
    url.searchParams.set('client_id', client_id);
    url.searchParams.set('redirect_uri', redirect_uri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', scope);
    url.searchParams.set('state', state);

    return url.href;
  }

  async exchange(
    ctx: IRequestContext,
    code: string,
  ): Promise<AccessTokenResult> {
    const tokenExchangeFn = await this.sandboxService.run<TokenExchangeFn>(
      ctx.connection.options.scripts.tokenExchange,
    );

    return await new Promise((resolve, reject) => {
      const cb = (err: Error, result: any) => {
        if (err) reject(err);
        else resolve(result);
      };

      tokenExchangeFn(code, cb);
    });
  }

  async fetchUserInfo(
    ctx: IRequestContext,
    access_token: string,
  ): Promise<ProfileDataModel> {
    const fetchUserProfileFn =
      await this.sandboxService.run<FetchUserProfileFn>(
        ctx.connection.options.scripts.fetchUserProfile,
      );

    return await new Promise((resolve, reject) => {
      const cb = (err: Error, profile: any) => {
        if (err) reject(err);
        else resolve(profile);
      };

      fetchUserProfileFn(
        access_token,
        {
          connection: {
            name: ctx.connection.name,
            strategy: ctx.connection.strategy,
          },
        },
        cb,
      );
    });
  }
}
