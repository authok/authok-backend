import { Global, Logger, Module } from '@nestjs/common';
import { PasswordlessTokenAuthenticationHandler } from 'libs/support/passwordless/src/passwordless-token-authentication.handler';
import { DefaultAuthenticationManager } from './default.authentication.manager';
import { PasswordRealmAuthenticationHandler } from './password-realm.authentication.handler';

@Global()
@Module({
  imports: [],
  providers: [
    PasswordlessTokenAuthenticationHandler,
    PasswordRealmAuthenticationHandler,
    {
      provide: 'IAuthenticationManager',
      useFactory: (
        passwordRealmAuthenticationHandler: PasswordRealmAuthenticationHandler,
        passwordlessTokenAuthenticationHandler: PasswordlessTokenAuthenticationHandler,
      ) => {
        const authenticationManager = new DefaultAuthenticationManager();
        authenticationManager.register(
          'password',
          passwordRealmAuthenticationHandler,
        );
        Logger.debug('register authenticationHandler: password');

        authenticationManager.register(
          'http://authok.io/oauth/grant-type/password-realm',
          passwordRealmAuthenticationHandler,
        );
        Logger.debug(
          'register authenticationHandler: http://authok.io/oauth/grant-type/password-realm',
        );

        authenticationManager.register(
          'http://authok.io/oauth/grant-type/passwordless/otp',
          passwordlessTokenAuthenticationHandler,
        );
        Logger.debug(
          'register authenticationHandler: http://authok.io/oauth/grant-type/passwordless/otp',
        );

        return authenticationManager;
      },
      inject: [
        PasswordRealmAuthenticationHandler,
        PasswordlessTokenAuthenticationHandler,
      ],
    },
  ],
  exports: ['IAuthenticationManager'],
})
export class AuthenticationModule {}
