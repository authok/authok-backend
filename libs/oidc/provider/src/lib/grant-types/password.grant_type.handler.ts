import { Injectable } from '@nestjs/common';
import { IGrantTypeHandler } from './grant_type.handler';
import { Provider } from '@authok/oidc-provider';

@Injectable()
export class PasswordGrantTypeHandler implements IGrantTypeHandler {
  constructor() {}

  handler(provider: Provider) {
    return async (ctx, next) => {};
  }

  get name(): string {
    return 'password';
  }

  get params(): string[] {
    return [];
  }

  get dupes(): string[] {
    return [];
  }
}
