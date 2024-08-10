import { IContext } from '@libs/nest-core';
import { Token } from './token';

export interface IPasswordlessTokenRepository {
  createToken(scene: string, key: string): Token;

  findToken(ctx: IContext, scene: string, key: string): Promise<Token | undefined>;

  deleteToken(ctx: IContext, scene: string, key: string): Promise<void>;

  saveToken(
    ctx: IContext,
    token: Token,
  ): Promise<void>;

  clean(ctx: IContext): Promise<void>;
}
