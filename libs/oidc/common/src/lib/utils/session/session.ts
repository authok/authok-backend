import * as instance from '@authok/oidc-provider/lib/helpers/weak_cache';
import * as ssHandler from '@authok/oidc-provider/lib/helpers/samesite_handler';

export async function saveOidcSession(ctx) {
  const sessionCookieName = ctx.oidc.provider.cookieName('session');
  const longRegExp = new RegExp(
    `^${sessionCookieName}(?:\\.legacy)?(?:\\.sig)?=`,
  );

  // refresh the session duration
  if (
    (!ctx.oidc.session.new || ctx.oidc.session.touched) &&
    !ctx.oidc.session.destroyed
  ) {
    let ttl = instance(ctx.oidc.provider).configuration('ttl.Session');

    if (typeof ttl === 'function') {
      ttl = ttl(ctx, ctx.oidc.session);
    }

    ssHandler.set(
      ctx.oidc.cookies,
      sessionCookieName,
      ctx.oidc.session.id,
      instance(ctx.oidc.provider).configuration('cookies.long'),
    );
    await ctx.oidc.session.save(ctx, ttl);
  }

  if (ctx.response.get('set-cookie')) {
    ctx.response.get('set-cookie').forEach((cookie, index, ary) => {
      /* eslint-disable no-param-reassign */
      if (
        !cookie.includes('expires=Thu, 01 Jan 1970') &&
        cookie.match(longRegExp) &&
        !ctx.oidc.session.transient &&
        ctx.oidc.session.exp
      ) {
        ary[index] += `; expires=${new Date(
          ctx.oidc.session.exp * 1000,
        ).toUTCString()}`;
      }
      /* eslint-enable */
    });
  }
}
