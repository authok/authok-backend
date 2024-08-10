import { NotFoundException } from '@nestjs/common';
import {
  AuthenticationHandler,
  IAuthenticationManager,
  ICredentials,
  IPrincipal,
} from 'libs/api/authentication-api/src';
import { IContext } from '@libs/nest-core';

export class DefaultAuthenticationManager implements IAuthenticationManager {
  private handlerMap: Record<string, AuthenticationHandler> = {};

  register(credentialType: string, handler: AuthenticationHandler) {
    this.handlerMap[credentialType] = handler;
  }

  unregister(credentialType: string) {
    delete this.handlerMap[credentialType];
  }

  async authenticate(
    ctx: IContext,
    credentials: ICredentials,
  ): Promise<IPrincipal> {
    const handler = this.handlerMap[credentials.credential_type];
    if (!handler) {
      throw new NotFoundException(
        `credentialType: ${credentials.credential_type} not found`,
      );
    }

    return await handler?.authenticate(ctx, credentials);
  }
}
