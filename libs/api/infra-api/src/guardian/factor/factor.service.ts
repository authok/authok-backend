import { IContext } from "@libs/nest-core";
import { FactorModel } from "./factor.model";

export interface IFactorService {
  get(ctx: IContext): Promise<FactorModel[]>;
}