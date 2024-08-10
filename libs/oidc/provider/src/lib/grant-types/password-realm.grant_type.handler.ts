import { Inject, Injectable, Logger } from '@nestjs/common';
import { IAuthenticationManager } from 'libs/api/authentication-api/src';

import { Provider } from '@authok/oidc-provider';
import * as checkResource from '@authok/oidc-provider/lib/shared/check_resource';
import { IGrantTypeHandler } from './grant_type.handler';
import * as processResponseTypes from '@authok/oidc-provider/lib/actions/authorization/process_response_types';
import * as sessionMiddleware from '@authok/oidc-provider/lib/shared/session';
import { UserModel } from 'libs/api/infra-api/src';

@Injectable()
export class PasswordRealmGrantTypeHandler implements IGrantTypeHandler {
  constructor(
    @Inject('IAuthenticationManager')
    private readonly authenticationManager: IAuthenticationManager,
  ) {}

  handler(provider: Provider) {
    return async (ctx, next) => {
      await sessionMiddleware(ctx, async () => {
        await checkResource(ctx, () => {});

        await this.handleInternal(ctx, next);
      });
    };
  }

  async handleInternal(ctx, next) {
    try {
      console.log('password-realm grant type');

      const tenant = ctx.req.customRequestContext?.tenant;
      if (!tenant) {
        ctx.body = {
          message: 'tenant not found',
        };
        ctx.status = 404;
        await next();
      }
      Logger.debug('found tenant');

      const credentials = {
        credential_type: 'http://authok.io/oauth/grant-type/password-realm',
        client_id: ctx.oidc.params.client_id,
        connection: ctx.oidc.params.connection || ctx.oidc.params.realm,
        username: ctx.oidc.params.username,
        password: ctx.oidc.params.password,
      };

      const principal = await this.authenticationManager.authenticate(
        ctx.req.customRequestContext,
        credentials,
      );

      if (!principal) {
        Logger.warn('authentication error, invalid credentials provided');
        ctx.body = {
          error: 'invalid_grant',
          error_description: 'invalid credentials provided',
        };
        ctx.status = 400;
        return;
      }

      // 并不需要做 sso
      const user = principal as UserModel;
      await ctx.oidc.session.loginAccount({
        tenant,
        accountId: user.user_id,
        loginTs: Math.floor(Date.now() / 1000),
        amr: ['pwd'],
        acr: 'urn:mace:incommon:iap:bronze',
        transient: false,
      });

      await this.loadAccount(ctx, user.user_id);
      await this.loadGrant(ctx);

      const response_types = ['token'];
      if (
        ctx.oidc.params.scope &&
        ctx.oidc.params.scope.split(' ').includes('openid')
      ) {
        response_types.push('id_token');
      }
      ctx.oidc.params.response_type = response_types.join(' ');

      const r = await processResponseTypes(ctx);
      ctx.body = r;
    } catch (e) {
      console.error('grant error ', e);

      ctx.body = {
        error: 'invalid_grant',
        error_description: e.message,
      };
      ctx.status = 400;
    }
    await next();
  }

  async loadAccount(ctx, accountId) {
    const account = await ctx.oidc.provider.Account.findAccount(ctx, accountId);
    ctx.oidc.entity('Account', account);
  }

  async loadGrant(ctx) {
    const grant = new ctx.oidc.provider.Grant({
      accountId: ctx.oidc.account.accountId,
      clientId: ctx.oidc.params.client_id,
    });
    grant.addOIDCScope(ctx.oidc.params.scope);

    await grant.save(ctx);
    ctx.oidc.session.grantIdFor(ctx.oidc.params.client_id, grant.jti);
    ctx.oidc.entity('Grant', grant);
  }

  get name(): string {
    return 'http://authok.io/oauth/grant-type/password-realm';
  }

  get params(): string[] {
    return [
      'realm',
      'connection',
      'username',
      'password',
      'audience',
      'captcha',
      'scope',
      'client_id',
    ];
  }

  get dupes(): string[] {
    return [];
  }
}
