import { IContext } from "@libs/nest-core";

export interface IExtension<T> {
  extend(ctx: IContext, target: T);
}