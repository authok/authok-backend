import { Injectable } from '@nestjs/common';
import { IGrantTypeHandler } from './grant_type.handler';
import { Provider } from '@authok/oidc-provider';

@Injectable()
export class MfaOobGrantTypeHandler implements IGrantTypeHandler {
  constructor() {}

  handler(provider: Provider) {
    return async (ctx, next) => {};
  }

  get name(): string {
    return 'http://authok.io/oauth/grant-type/mfa-oob';
  }

  get params(): string[] {
    return [];
  }

  get dupes(): string[] {
    return [];
  }
}
