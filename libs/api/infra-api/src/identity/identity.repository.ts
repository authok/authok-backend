import { IRequestContext } from '@libs/nest-core';
import { IdentityDto } from './identity.dto';

export interface IIdentityRepository {
  retrieve(ctx: IRequestContext, id: string): Promise<IdentityDto | undefined>;

  findByConnection(
    ctx: IRequestContext,
    connection: string,
    user_id: string,
  ): Promise<IdentityDto | undefined>;

  update(
    ctx: IRequestContext,
    identity: Partial<IdentityDto>,
  ): Promise<{ affected?: number }>;
}
