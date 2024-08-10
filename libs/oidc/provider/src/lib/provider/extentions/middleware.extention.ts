import { Provider } from '@authok/oidc-provider';
import { Injectable, Logger } from '@nestjs/common';
import { IContext } from '@libs/nest-core';
import { IExtension } from '../extention';

@Injectable()
export class MiddlewareExtension implements IExtension<Provider> {
  constructor() {}

  extend(_ctx: IContext, provider: Provider) {
    provider.app.on('error', (err, ctx) => {
      console.log('provider error', err);
    });

    provider.use(async (ctx, next) => {
      ctx.tenant = _ctx.tenant;

      if (ctx.req.path === '/oauth/token') {
        console.log('cookie: ', ctx.req.cookies);
      }

      await next();
    });

    provider.use(async (ctx, next) => {
      /** pre-processing
       * you may target a specific action here by matching `ctx.path`
       */
      Logger.debug(`========== 进入 OIDC endpoint: ${ctx.path}, ${ctx.method}`);

      await next();

      /** post-processing
       * since internal route matching was already executed you may target a specific action here
       * checking `ctx.oidc.route`, the unique route names used are
       *
       * `authorization`
       * `backchannel_authentication`
       * `client_delete`
       * `client_update`
       * `client`
       * `code_verification`
       * `cors.device_authorization`
       * `cors.discovery`
       * `cors.introspection`
       * `cors.jwks`
       * `cors.pushed_authorization_request`
       * `cors.revocation`
       * `cors.token`
       * `cors.userinfo`
       * `device_authorization`
       * `device_resume`
       * `discovery`
       * `end_session_confirm`
       * `end_session_success`
       * `end_session`
       * `introspection`
       * `jwks`
       * `pushed_authorization_request`
       * `registration`
       * `resume`
       * `revocation`
       * `token`
       * `userinfo`
       */

      if (ctx.oidc.route === 'resume') {
        console.log('ctxfuck: ', ctx.body);
      }

      Logger.debug(
        `========== 结束 OIDC endpoint: ${ctx.oidc.route}, ${ctx.path}, ${ctx.method}`,
      );
    });

    provider.on('authorization.success', (ctx, out) => {
      // 授权成功，如果有 organization, 则保存, 没有则清除
      ctx.oidc.session.authorizationFor(ctx.oidc.client.clientId).org_id =
        ctx.oidc.params.organization;

      console.log(
        '授权成功: ',
        ctx.req.path,
        ctx.oidc.params.organization,
        out,
      );
    });

    provider.on('grant.success', (ctx) => {
      console.log('grant成功: ', ctx.req.path, ctx.body);
    });

    provider.on('end_session.success', (ctx, out) => {
      console.log('end_session.success: ', ctx.req.path, ctx.oidc.params);
    });

    provider.on('authorization.accepted', async (ctx, out) => {
      console.log('授权被接受');
    });

    provider.on('authorization.error', (ctx, out) => {
      console.error('授权发生错误: ', out);
    });
  }
}
