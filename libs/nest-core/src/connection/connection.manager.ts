import { IContext } from "../interfaces";

type IConnection = any;

export interface IConnectionManager {
  get(ctx: IContext): Promise<IConnection>;
}