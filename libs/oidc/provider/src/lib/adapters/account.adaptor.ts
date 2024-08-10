import { IUserService } from 'libs/api/infra-api/src';
import { Logger } from '@nestjs/common';

export function accountAdaptor(userService: IUserService): any {
  return class AccountAdaptor {
    private accountId: string;
    private profile: Record<string, any>;

    constructor(id, profile) {
      this.accountId = id;
      this.profile = profile;
    }

    /**
     * @param use - can either be "id_token" or "userinfo", depending on
     *   where the specific claims are intended to be put in.
     * @param scope - the intended scope, while oidc-provider will mask
     *   claims depending on the scope automatically you might want to skip
     *   loading some claims from external resources etc. based on this detail
     *   or not return them in id tokens but only userinfo and so on.
     * @param claims 开启了 claimsParameters 后，这个才会有效
     */
    async claims(use, scope, claims, rejected) {
      // eslint-disable-line no-unused-vars
      // 没有开启 features.claimsParameter.enabled ，忽略 claims

      return {
        sub: this.accountId, // it is essential to always return a sub claim
        ...this.profile,
      };
    }

    static async findByFederated(provider, claims) {
      // TODO
      return null;
    }

    static async findByLogin(login) {
      // TODO
    }

    static async findAccount(ctx, user_id, token) {
      const { InvalidRequest } = await import('@authok/oidc-provider/lib/helpers/errors');

      const user: Record<string, any> = await userService.retrieve(
        ctx.req.customRequestContext,
        user_id,
      );
      if (!user) {
        // session id是随机生成的，所以就需要额外记录一个 user_id => session id 的映射表，才可以让其它地方根据 user_id 来修改 session
        Logger.warn(
          `findAccount, 用户 user_id: ${ctx.req.customRequestContext.tenant} ${user_id} 找不到, 可能是 link 导致用户不存在，需要清理session, 否则session存在, 但用户不存在就会一直报错, 或者在link后把 session userId 进行修改, 这里要验证下 auth0, 感觉 auth0 应该在 linkAccount 后修改了session 的 accountId, 这样用户体验更好`,
        );
        // 这里 session 不存在会不会报错?
        await ctx.session.destroy(ctx);

        /* TODO 清除 cookie 这一步暂时没做
        ssHandler.set(
          ctx.oidc.cookies,
          ctx.oidc.provider.cookieName('session'),
          null,
          opts,
        );
        */

        throw new InvalidRequest('user not found');
      }

      console.log('findAccount grant: ', ctx.oidc.grant);

      const profile = user;
      let session;

      if (ctx.oidc.session) {
        // 主要作为 IdToken 用途
        session = ctx.oidc.session;

        console.log('findAccount 会话存在, 代表客户端请求: ', session);
      } else {
        console.log(
          'findAccount 会话不存在, 代表服务端请求, token 代表 authorizationCode, 从其先提取 sessionId',
          ctx.req.path,
          token,
        );

        if (token.sessionUid) {
          session = await ctx.oidc.provider.Session.findByUid(
            ctx,
            token.sessionUid,
          );

          console.log(
            `findAccount 根据 sessionId: ${token.sessionId} 查找到会话: `,
            session,
          );
        } else {
          console.warn(
            `findAccount 根据 sessionId: ${token.sessionId} 没有找到会话: `,
            session,
          );
        }
      }

      if (session) {
        const org_id = session.authorizationFor(
          ctx.oidc.client.clientId,
        ).org_id;
        if (org_id) {
          console.log(
            'findAccount 会话中有 org_id ',
            org_id,
            ctx.req.path,
            ctx.oidc.params,
          );

          profile.org_id = org_id;
        } else {
          console.log('findAccount 会话中没有 org_id');
        }
      }

      return new AccountAdaptor(user_id, profile);
    }
  };
}
