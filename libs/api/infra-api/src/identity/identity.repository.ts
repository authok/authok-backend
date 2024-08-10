import { IRequestContext } from '@libs/nest-core';
import { IdentityModel } from './identity.model';

export interface IIdentityRepository {
  retrieve(ctx: IRequestContext, id: string): Promise<IdentityModel | undefined>;

  findByConnection(
    ctx: IRequestContext,
    connection: string,
    user_id: string,
  ): Promise<IdentityModel | undefined>;

  update(
    ctx: IRequestContext,
    identity: Partial<IdentityModel>,
  ): Promise<{ affected?: number }>;
}
