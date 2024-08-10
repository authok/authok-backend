import { IContext } from '@libs/nest-core';
import { IdentityModel } from './identity.model';

export interface IIdentityService {
  retrieve(ctx: IContext, id: string): Promise<IdentityModel | undefined>;

  findByConnection(
    ctx: IContext,
    connection: string,
    id: string,
  ): Promise<IdentityModel | undefined>;

  update(
    ctx: IContext,
    id: string,
    identity: Partial<IdentityModel>,
  ): Promise<IdentityModel>;
}
