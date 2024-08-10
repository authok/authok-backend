import { Injectable, Inject, Logger } from '@nestjs/common';
import { Provider } from '@authok/oidc-provider';
import checkResource from '@authok/oidc-provider/lib/shared/check_resource';
import { InvalidTarget } from '@authok/oidc-provider/lib/helpers/errors';
import { ResourceServer } from '@authok/oidc-provider/lib/helpers/resource_server';
import { IGrantTypeHandler } from './grant_type.handler';

import { IAuthenticationManager } from 'libs/api/authentication-api/src';
import { PasswordlessCredentials } from 'libs/support/passwordless/src/credentials';
import { UserModel } from 'libs/api/infra-api/src';

@Injectable()
export class PasswordlessOtpGrantTypeHandler implements IGrantTypeHandler {
  constructor(
    @Inject('IAuthenticationManager')
    private readonly authenticationManager: IAuthenticationManager,
  ) {}

  handler(provider: Provider) {
    return async (ctx, next) => {
      try {
        console.log('password-realm grant type', ctx.oidc.params);

        const tenant = ctx.req.customRequestContext?.tenant;
        if (!tenant) {
          ctx.body = {
            message: 'tenant not found',
          };
          ctx.status = 404;
          await next();
        }
        Logger.debug('found tenant');

        await checkResource(ctx, () => {});

        const credentials = {
          credential_type: 'http://authok.io/oauth/grant-type/passwordless/otp',
          client_id: ctx.oidc.params.client_id,
          connection: ctx.oidc.params.connection,
          otp: ctx.oidc.params.otp,
        } as PasswordlessCredentials;

        if (ctx.oidc.params.connection === 'sms') {
          credentials.phone_number = ctx.oidc.params.phone_number || ctx.oidc.params.username
        } else if (ctx.oidc.params.connection === 'sms') {
          credentials.email = ctx.oidc.params.email || ctx.oidc.params.username;
        }

        const principal = await this.authenticationManager.authenticate(
          {
            tenant,
            client: ctx.oidc.client,
          },
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

        const user = principal as UserModel;

        const grant = new provider.Grant({
          accountId: user.user_id,
          clientId: ctx.oidc.params.client_id,
        });
        grant.addOIDCScope(ctx.oidc.params.scope);
        console.log('grant: ', grant);

        const grantId = await grant.save(ctx);
        console.log('grantId: ', grantId);

        const AccessToken = provider.AccessToken;
        const at = new AccessToken({
          gty: 'passwordless/otp',
          accountId: user.user_id,
          client: ctx.oidc.client,
          grantId,
          scope: ctx.oidc.params.scope,
        });

        const scopes = ctx.oidc.params.scope
          ? [...new Set(ctx.oidc.params.scope.split(' '))]
          : [];

        // console.log('ctx.oidc.resourceServers', ctx.oidc.resourceServers);

        Object.values(ctx.oidc.resourceServers).forEach(
          (resourceServer: ResourceServer, i: number) => {
            if (i !== 0) {
              throw new InvalidTarget(
                'only a single resource indicator value is supported for this grant type',
              );
            }
            // console.log('找到 resourceServer', resourceServer);
            at.resourceServer = resourceServer;

            // 这个 scope 应该根据 用户自己的scopes, 还有 resource_server的scopes 和 请求的scopes做一个交集
            at.scope =
              scopes
                .filter(
                  Set.prototype.has.bind(
                    new Set(resourceServer.scope.split(' ')),
                  ),
                )
                .join(' ') || undefined;
            console.log('scopes: ', at.scope, resourceServer.scope);
          },
        );

        let access_token;
        try {
          access_token = await at.save();
        } catch (e) {
          console.error(e);
        }

        ctx.body = {
          access_token,
          expires_in: at.expiration,
          token_type: 'Bearer',
        };
      } catch (e) {
        Logger.error('grant error ' + e);

        ctx.body = {
          error: 'invalid_grant',
          error_description: e.message,
        };
        ctx.status = 400;
      }
      await next();
    };
  }

  get name(): string {
    return 'http://authok.io/oauth/grant-type/passwordless/otp';
  }

  get params(): string[] {
    return [
      'client_id',
      'connection',
      'username',
      'otp',
      'scope',
      'audience',
      'captcha',
    ];
  }

  get dupes(): string[] {
    return [];
  }
}
