import { IContext } from "@libs/nest-core";


export interface ITokenExchangeProvider {
  exchange(ctx: IContext): Promise<any>;
}