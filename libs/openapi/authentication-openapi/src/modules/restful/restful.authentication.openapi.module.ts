import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
import { AuthnController } from './authn/authn.controller';
import { PasswordlessController } from './authn/passwordless.controller';
import { DBConnectionController } from './signup/dbconnections.controller';
import { OAuthController } from './oauth/oauth.controller';
import { OAuthService } from './oauth/oauth.service';
import { MFAController } from './mfa/mfa.controller';
import { WsfedController } from './ws-federation/wsfed.controller';
import { UserController } from './user/user.controller';
import { UserValidationMiddleware } from '@libs/oidc/common/lib/middleware/user-validation/user-validation.middleware';
import { PasswordValidationMiddleware } from '@libs/oidc/common/lib/middleware/password-validation/password-validation.middleware';
import { WellKnownController } from './well-known/well-known.controller';
import { SAMLPController } from './samlp/samlp.controller';
import { JoiPipeModule } from 'nestjs-joi';
import { ClientController } from './client/client.controller';
import { UsernamePasswordController } from './authn/usernamepassword.controller';
import { CrossDomainAuthenticationController } from './authn/cross-domain-authentication.controller';
import { HomeController } from './home.controller';
import { ContinueController } from './authn/continue.controller';

@Module({
  controllers: [
    AuthnController,
    CrossDomainAuthenticationController,
    PasswordlessController,
    UsernamePasswordController,
    DBConnectionController,
    OAuthController,
    ClientController,
    MFAController,
    WsfedController,
    UserController,
    SAMLPController,
    WellKnownController,
    HomeController,
    ContinueController
  ],
  providers: [OAuthService],
  imports: [JoiPipeModule.forRoot({
    pipeOpts: {
      defaultValidationOptions: {
        allowUnknown: false,
      }
    }
  })],
})
export class RestfulAuthenticationOpenApiModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserValidationMiddleware).forRoutes({
      path: 'user/register',
      method: RequestMethod.POST,
    });
    consumer.apply(PasswordValidationMiddleware).forRoutes({
      path: 'user/npw/:token',
      method: RequestMethod.POST,
    });
  }
}
