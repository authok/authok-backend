import { Provider } from '@authok/oidc-provider';
import { Injectable } from '@nestjs/common';
import * as wildcard from 'wildcard';
import { IContext } from '@libs/nest-core';
import { IExtension } from '../extention';

@Injectable()
export class WildcardRedirectUriSupportExtension implements IExtension<Provider> {
  constructor(
  ) {}

  extend(ctx: IContext, provider: Provider) {
    const { redirectUriAllowed } = provider.Client.prototype;

    const hasWildcardHost = (redirectUri) => {
      const { hostname } = new URL(redirectUri);
      return hostname.includes('*');
    };
  
    const wildcardMatches = (redirectUri, wildcardUri) => !!wildcard(wildcardUri, redirectUri);
    
    provider.Client.prototype.redirectUriAllowed = function wildcardRedirectUriAllowed(redirectUri) {
      if (!redirectUri.includes('*')) {
        return redirectUriAllowed.call(this, redirectUri);
      }
      const wildcardUris = this.redirectUris.filter(hasWildcardHost);
      return wildcardUris.some(wildcardMatches.bind(undefined, redirectUri));
    };
  }
}