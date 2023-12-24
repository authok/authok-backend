import { IRequestContext } from '@libs/nest-core';
import { Token } from './token';

export interface IPasswordlessTokenRepository {
  createToken(scene: string, key: string): Token;

  findToken(ctx: IRequestContext, scene: string, key: string): Promise<Token | undefined>;

  deleteToken(ctx: IRequestContext, scene: string, key: string): Promise<void>;

  saveToken(
    ctx: IRequestContext,
    token: Token,
  ): Promise<void>;

  clean(ctx: IRequestContext): Promise<void>;
}
