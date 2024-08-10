import {
  Module,
  Global,
  Injectable,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { OidcService } from './services/oidc.service';
import { AdapterManager } from './adapters/adapter.manager';
import { TypeOrmAdapter } from './adapters/typeorm.adapter';
import {
  DeviceCode,
  ClientCredentials,
  InitialAccessToken,
  RegistrationAccessToken,
  ReplayDetection,
  PushedAuthorizationRequest,
  TypeORMEntities,
} from '@libs/oidc/common';
import { RedisAdapter } from './adapters/redis.adapter';
import { RedisService } from '@authok/nestjs-redis';
import { PasswordRealmGrantTypeHandler } from './grant-types/password-realm.grant_type.handler';
import { MfaOobGrantTypeHandler } from './grant-types/mfa-oob.grant_type.handler';
import { MfaOtpGrantTypeHandler } from './grant-types/mfa-otp.grant_type.handler';
import { MfaRecoveryCodeGrantTypeHandler } from './grant-types/mfa-recovery-code.grant_type.handler';
import { PasswordGrantTypeHandler } from './grant-types/password.grant_type.handler';
import { PasswordlessOtpGrantTypeHandler } from './grant-types/passwordless-otp.grant_type.handler';
import { ClientAdaptor } from './adapters/client.adaptor';
import { TenantConnectionManager } from 'libs/tenant-connection-manager/src/tenant.connection.manager';
import { InteractionController } from './controllers/interaction.controller';
import { UserinfoController } from './controllers/userinfo.controller';
import { IGrantTypeHandler } from './grant-types/grant_type.handler';
import { GrantTypeExtension } from './provider/extentions/grant-type.extention';
import { MiddlewareExtension } from './provider/extentions/middleware.extention';
import { ProtoTypeExtension } from './provider/extentions/prototype.extension';
import { TokenPipelineExtension } from './provider/extentions/token-pipeline.extention';
import { WildcardRedirectUriSupportExtension } from './provider/extentions/wildcard-redirecturi-support.extention';
import { GrantAdaptor } from './adapters/grant.adaptor';
import { FederatedLoginController } from './controllers/federated-login.controller';
import { InteractionExtension } from './provider/configuration/extentions/interaction.extension';
import { RenderErrorExtension } from './provider/configuration/extentions/render-error.extension';
import { LoadGrantExtension } from './provider/configuration/extentions/load-grant.extension';
import { AdaptorExtension } from './provider/configuration/extentions/adaptor.extension';
import { ClientGrantExtension } from './provider/configuration/extentions/client-grant.extension';
import { FormatsExtension } from './provider/configuration/extentions/formats.extension';
import { ResourceIndicatorsExtension } from './provider/configuration/extentions/resource-indicators.extension';
import { TokenExchangeGrantTypeHandler } from './grant-types/token-exchange.grant_type.handler';

@Injectable()
class ModuleInitialer implements OnModuleInit {
  constructor(
    @Inject('IConnectionManager')
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  onModuleInit() {
    this.tenantConnectionManager.addEntities(
      DeviceCode,
      ClientCredentials,
      InitialAccessToken,
      RegistrationAccessToken,
      ReplayDetection,
      PushedAuthorizationRequest,
    );
  }
}

@Global()
@Module({
  providers: [
    ModuleInitialer,
    PasswordGrantTypeHandler,
    PasswordRealmGrantTypeHandler,
    MfaOobGrantTypeHandler,
    MfaOtpGrantTypeHandler,
    MfaRecoveryCodeGrantTypeHandler,
    PasswordlessOtpGrantTypeHandler,
    TokenExchangeGrantTypeHandler,
    OidcService,
    // configuration extension
    AdaptorExtension,
    ClientGrantExtension,
    FormatsExtension,
    InteractionExtension,
    LoadGrantExtension,
    RenderErrorExtension,
    ResourceIndicatorsExtension,
    {
      provide: 'OIDCConfigurationExtensions',
      useFactory: (
        adaptorExtension: AdaptorExtension,
        clientGrantExtension: ClientGrantExtension,
        formatsExtension: FormatsExtension,
        interactionExtension: InteractionExtension,
        loadGrantExtension: LoadGrantExtension,
        renderErrorExtension: RenderErrorExtension,
        resourceIndicatorsExtension: ResourceIndicatorsExtension,
      ) => [
        adaptorExtension,
        clientGrantExtension,
        formatsExtension,
        interactionExtension,
        loadGrantExtension,
        renderErrorExtension,
        resourceIndicatorsExtension,
      ],
      inject: [
        AdaptorExtension,
        ClientGrantExtension,
        FormatsExtension,
        InteractionExtension,
        LoadGrantExtension,
        RenderErrorExtension,
        ResourceIndicatorsExtension,
      ],
    },
    // provider extension
    GrantTypeExtension,
    MiddlewareExtension,
    ProtoTypeExtension,
    TokenPipelineExtension,
    WildcardRedirectUriSupportExtension,
    {
      provide: 'OIDCProviderExtensions',
      useFactory: (
        grantTypeExtension: GrantTypeExtension,
        middlewareExtension: MiddlewareExtension,
        prototypeExtension: ProtoTypeExtension,
        tokenPipelineExtension: TokenPipelineExtension,
        wildcardRedirectUriExtension: WildcardRedirectUriSupportExtension,
      ) => {
        return [
          grantTypeExtension,
          middlewareExtension,
          prototypeExtension,
          tokenPipelineExtension,
          wildcardRedirectUriExtension,
        ];
      },
      inject: [
        GrantTypeExtension,
        MiddlewareExtension,
        ProtoTypeExtension,
        TokenPipelineExtension,
        WildcardRedirectUriSupportExtension,
      ],
    },
    {
      provide: 'GrantTypeHandlers',
      useFactory: (
        // clientCredentialsGrantTypeHandler: ClientCredentialsGrantTypeHandler,
        passwordGrantTypeHandler: PasswordGrantTypeHandler,
        passwordRealmGrantTypeHandler: PasswordRealmGrantTypeHandler,
        mfaOobGrantTypeHandler: MfaOobGrantTypeHandler,
        mfaOtpGrantTypeHandler: MfaOtpGrantTypeHandler,
        mfaRecoveryCodeGrantTypeHandler: MfaRecoveryCodeGrantTypeHandler,
        passwordlessOtpGrantTypeHandler: PasswordlessOtpGrantTypeHandler,
        tokenExchangeGrantTypeHandler: TokenExchangeGrantTypeHandler,
      ) => {
        const grantTypeHandlers = new Set<IGrantTypeHandler>();
        grantTypeHandlers.add(passwordGrantTypeHandler);
        grantTypeHandlers.add(passwordRealmGrantTypeHandler);
        grantTypeHandlers.add(mfaOobGrantTypeHandler);
        grantTypeHandlers.add(mfaOtpGrantTypeHandler);
        grantTypeHandlers.add(mfaRecoveryCodeGrantTypeHandler);
        grantTypeHandlers.add(passwordlessOtpGrantTypeHandler);
        grantTypeHandlers.add(tokenExchangeGrantTypeHandler);

        return grantTypeHandlers;
      },
      inject: [
        PasswordGrantTypeHandler,
        PasswordRealmGrantTypeHandler,
        MfaOobGrantTypeHandler,
        MfaOtpGrantTypeHandler,
        MfaRecoveryCodeGrantTypeHandler,
        PasswordlessOtpGrantTypeHandler,
        TokenExchangeGrantTypeHandler,
      ],
    },
    {
      provide: AdapterManager,
      useFactory: (
        tenantConnectionManager: TenantConnectionManager,
        redisService: RedisService,
        clientAdaptor: ClientAdaptor,
        grantAdaptor: GrantAdaptor,
      ) => {
        const adapterManager = new AdapterManager();

        adapterManager.register('Client', clientAdaptor);
        adapterManager.register('Grant', grantAdaptor);

        const entities = new Map<string, TypeORMEntities>([
          ['DeviceCode', DeviceCode],
          ['ClientCredentials', ClientCredentials],
          ['InitialAccessToken', InitialAccessToken],
          ['RegistrationAccessToken', RegistrationAccessToken],
          ['ReplayDetection', ReplayDetection],
          ['PushedAuthorizationRequest', PushedAuthorizationRequest],
        ]);

        entities.forEach((entityType, entityName) => {
          console.log('register: ', entityName, entityType);
          adapterManager.register(
            entityName,
            new TypeOrmAdapter(entityName, entityType, tenantConnectionManager),
          );
        });

        const entitiesForRedis = [
          'Session',
          'Interaction',
          'AuthorizationCode',
          'AccessToken',
          'RefreshToken',
        ];
        entitiesForRedis.forEach((entityName) => {
          adapterManager.register(
            entityName,
            new RedisAdapter(entityName, redisService),
          );
        });

        return adapterManager;
      },
      inject: ['IConnectionManager', RedisService, ClientAdaptor, GrantAdaptor],
    },
    ClientAdaptor,
    GrantAdaptor,
  ],
  controllers: [
    InteractionController,
    FederatedLoginController,
    UserinfoController,
  ],
  exports: [OidcService],
})
export class OIDCProviderModule {}
