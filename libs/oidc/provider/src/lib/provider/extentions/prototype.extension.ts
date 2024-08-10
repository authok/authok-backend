import { Provider } from '@authok/oidc-provider';
import { Injectable } from '@nestjs/common';
import { saveOidcSession } from '@libs/oidc/common/lib/utils/session/session';
import { IContext } from '@libs/nest-core';
import { IExtension } from '../extention';

@Injectable()
export class ProtoTypeExtension implements IExtension<Provider> {
  extend(ctx: IContext, provider: Provider) {
    provider.OIDCContext.prototype.setAuthenticatedUser = function (ctx, user) {
      // 要把上一个 session + client 对应的 grant 清除掉，否则会报错
      const session = this.session;
  
      // 把现有 session 清空
      session.authorizations = {};
      session.state = undefined;
      session.resetIdentifier();
  
      // 登入新的账户
      session.loginAccount({
        accountId: user.user_id,
        loginTs: Math.floor(Date.now() / 1000),
        amr: ['pwd'],
        acr: 'urn:mace:incommon:iap:bronze',
        transient: false,
      });
      saveOidcSession(ctx);
    }
  }
}