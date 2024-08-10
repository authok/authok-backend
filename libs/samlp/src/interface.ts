import { IContext } from "@libs/nest-core";
import * as samlify from 'samlify';

export interface ISAMLPService {
  findIdp(ctx: IContext, client_id: string): Promise<samlify.IdentityProviderInstance>;

  findSp(ctx: IContext, client_id: string): Promise<samlify.ServiceProviderInstance>;
}