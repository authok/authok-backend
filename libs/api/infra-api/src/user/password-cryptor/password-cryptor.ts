import { IContext } from "@libs/nest-core";

export interface IPasswordCryptor {
  // 加密
  encrypt(ctx: IContext, password: string);

  compare(ctx: IContext, password1: string, password2: string): Promise<boolean>;
}