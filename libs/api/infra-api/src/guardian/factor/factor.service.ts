import { IRequestContext } from "@libs/nest-core";
import { Factor } from "./factor.model";

export interface IFactorService {
  get(ctx: IRequestContext): Promise<Factor[]>;
}