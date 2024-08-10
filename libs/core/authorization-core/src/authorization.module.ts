import { Global, Module } from '@nestjs/common';
import { AuthorizationManager } from './idp/authorization.manager';
import { OAuth2IdentityProvider } from './idp/oauth2.identity.provider';
import { WechatPCIdentityProvider } from './idp/social/wechat/wechat_pc.identity.provider';
import { WeworkIdentityProvider } from './idp/social/wework/wework.identity.provider';
import { FacebookIdentityProvider } from './idp/social/facebook/facebook.identity.provider';
import { GithubIdentityProvider } from './idp/social/github/github.identity.provider';
import { TiktokIdentityProvider } from './idp/social/tiktok/tiktok.identity.provider';
import { DouyinIdentityProvider } from './idp/social/douyin/douyin.identity.provider';
import { GoogleIdentityProvider } from './idp/social/google/google.identity.provider';
import { DoudianIdentityProvider } from './idp/social/doudian/doudian.identity.provider';
import { OIDCIdentityProvider } from './idp/oidc.identity.provider';

@Global()
@Module({
  providers: [
    OAuth2IdentityProvider,
    WechatPCIdentityProvider,
    WeworkIdentityProvider,
    DouyinIdentityProvider,
    TiktokIdentityProvider,
    GoogleIdentityProvider,
    FacebookIdentityProvider,
    GithubIdentityProvider,
    DoudianIdentityProvider,
    OIDCIdentityProvider,
    {
      provide: 'IAuthorizationManager',
      useFactory: (
        oauth2IdentityProvider: OAuth2IdentityProvider,
        wechatPCIdentityProvider: WechatPCIdentityProvider,
        weworkIdentityProvider: WeworkIdentityProvider,
        douyinIdentityProvider: DouyinIdentityProvider,
        tiktokIdentityProvider: TiktokIdentityProvider,
        googleIdentityProvider: GoogleIdentityProvider,
        facebookIdentityProvider: FacebookIdentityProvider,
        githubIdentityProvider: GithubIdentityProvider,
        doudianIdentityProvider: DoudianIdentityProvider,
        oidcIdentityProvider: OIDCIdentityProvider,
      ) => {
        const authorizationManager = new AuthorizationManager();
        // authorizationManager.register('email', dbAuthorizationHandler);
        // authorizationManager.register('sms', dbAuthorizationHandler);

        // 社会化
        authorizationManager.register('oauth2', oauth2IdentityProvider);
        authorizationManager.register('wechat:pc', wechatPCIdentityProvider);
        authorizationManager.register('wework', weworkIdentityProvider);
        authorizationManager.register('douyin', douyinIdentityProvider);

        authorizationManager.register('tiktok', tiktokIdentityProvider);
        authorizationManager.register('google', googleIdentityProvider);
        authorizationManager.register('facebook', facebookIdentityProvider);
        authorizationManager.register('github', githubIdentityProvider);
        authorizationManager.register('doudian', doudianIdentityProvider);

        authorizationManager.register('oidc', oidcIdentityProvider);

        return authorizationManager;
      },
      inject: [
        OAuth2IdentityProvider, 
        WechatPCIdentityProvider,
        WeworkIdentityProvider,
        DouyinIdentityProvider,
        TiktokIdentityProvider, 
        GoogleIdentityProvider, 
        FacebookIdentityProvider, 
        GithubIdentityProvider,
        DoudianIdentityProvider,
        OIDCIdentityProvider,
      ],
    },
  ],
  exports: ['IAuthorizationManager'],
})
export class AuthorizationModule {}
