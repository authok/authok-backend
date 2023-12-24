import { IContext } from '@libs/nest-core';
import { IdentityDto } from './identity.dto';

export interface IIdentityService {
  retrieve(ctx: IContext, id: string): Promise<IdentityDto | undefined>;

  findByConnection(
    ctx: IContext,
    connection: string,
    id: string,
  ): Promise<IdentityDto | undefined>;

  update(
    ctx: IContext,
    id: string,
    identity: Partial<IdentityDto>,
  ): Promise<IdentityDto>;
}
