import { Inject, Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { IRequestContext } from '@libs/nest-core';
import * as _ from 'lodash';
import * as crypto from 'crypto';
import { IAuthorizationHandler } from 'libs/api/authorization-api/src/authorization.handler';
import { Issuer } from 'openid-client';

@Injectable()
export class OIDCIdentityProvider implements IAuthorizationHandler {
  async authorize(
    ctx: IRequestContext,
    req: Request,
    res: Response,
  ): Promise<void> {
    const authorizationUrl = await this.buildAuthorizationUrl(ctx, req, res);

    res.redirect(authorizationUrl);
  }

  // https://growingbox.us.auth0.com/login?state=hKFo2SB4MUNTeVNFUHhpT3JmSndtQkFtcXpuZWF0bElwNEczYaFupWxvZ2luo3RpZNkgWHFXV3pDa3B2RTRrRUtmNXN3S1g0VXgwN2pQTzlTMS2jY2lk2SAwbXg0dzhQZ2ZtTHpVNTJXbWhqamFrUmVoMDZMck9SdQ&client=0mx4w8PgfmLzU52WmhjjakReh06LrORu&protocol=oauth2&prompt=login&scope=openid%20profile%20email&response_type=id_token&redirect_uri=https%3A%2F%2Fgrowingbox1.au.auth0.com%2Flogin%2Fcallback&response_mode=form_post&nonce=qhp_JcqpzvXWgICN_sQ1DbuDrWs3mGFow2bzBRTqOfk
  async buildAuthorizationUrl(
    ctx: IRequestContext,
    req: Request,
    res: Response,
  ): Promise<string> {
    const options = ctx.connection.options;
    const discovery_url = options.discovery_url as string;
    const client_id = options.client_id as string;
    const scope = (req.query.connection_scope as string) || options.scope;

    const issuer = await Issuer.discover(discovery_url);

    const client = new issuer.Client({
      client_id,
      redirect_uris: [`https://${req.hostname}/login/callback`],
      response_types: ['id_token'],
    });

    const state = `${ctx.connection.name}|${crypto
      .randomBytes(32)
      .toString('hex')}`;
    const nonce = crypto.randomBytes(32).toString('hex');
    (req as any).session[`${ctx.connection.name}.state`] = state;
    (req as any).session[`${ctx.connection.name}.nonce`] = nonce;

    const authorizationURL = client.authorizationUrl({
      scope,
      state,
      nonce,
      prompt: 'login',
      response_type: 'id_token',
      response_mode: 'form_post',
      protocol: 'oauth2',
    });
    console.log('authorizationURL: ', authorizationURL);

    return authorizationURL;
  }
}
