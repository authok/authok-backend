import { ICredentials, IPrincipal } from './credentials.interface';
import { IRequestContext } from '@libs/nest-core';



export abstract class AuthenticationHandler {
  async authenticate(
    ctx: IRequestContext,
    credentials: ICredentials,
  ): Promise<IPrincipal> {
    return await this.doAuthenticate(ctx, credentials);
  }

  protected abstract doAuthenticate(
    ctx: IRequestContext,
    credentials: ICredentials,
  ): Promise<IPrincipal>;
}
