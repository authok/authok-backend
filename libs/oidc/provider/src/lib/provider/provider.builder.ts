import { Provider as OidcProvider, Configuration } from '@authok/oidc-provider';
import { Logger } from '@nestjs/common';
import { IContext } from '@libs/nest-core';
import { IExtension } from './extention';

export class OIDCProviderBuilder {
  private _configuration: Configuration; 
  private _issuer: string;
  private _proxy: boolean;

  private _extentions: IExtension<OidcProvider>[] = [];

  build(ctx: IContext): OidcProvider {
    const provider = new OidcProvider(this._issuer, this._configuration);

    for (const extention of this._extentions) {
      Logger.log(`OIDCProvider extend >> ${extention.constructor.name}`);
      extention.extend(ctx, provider);
    }

    provider.proxy = this._proxy;

  // this.installImplicitNotCheckHttps(oidcProvider);
  // this.installAuthorizationSuccessCallback(provider);

    return provider;
  }

  extend(...extentions: IExtension<OidcProvider>[]): OIDCProviderBuilder {
    for (const extention of extentions) {
      this._extentions.push(extention);
    }
    return this;
  }

  issuer(issuer: string): OIDCProviderBuilder {
    this._issuer = issuer;
    return this;
  }

  configuration(configuration: Configuration): OIDCProviderBuilder {
    this._configuration = configuration;
    return this;
  }

  proxy(val: boolean): OIDCProviderBuilder {
    this._proxy = val;
    return this;
  }
}