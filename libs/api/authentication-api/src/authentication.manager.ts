import { IPrincipal, ICredentials } from './credentials.interface';
import { IContext } from '@libs/nest-core';

export interface IAuthenticationManager {
  authenticate(ctx: IContext, credentials: ICredentials): Promise<IPrincipal>;
}
