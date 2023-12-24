import { Request, Response } from 'express';
import { IRequestContext } from '@libs/nest-core';
import { IAuthorizationHandler } from './authorization.handler';

export interface SocialSignInData {
  access_token: string;
  connection: string;
}

export interface IAuthorizationManager {
  authorize(
    strategy: string,
    ctx: IRequestContext,
    req: Request,
    res: Response,
  ): Promise<void>;

  get(strategy: string): IAuthorizationHandler;

  // TODO 设计返回类型
  oauthSignIn(
    ctx: IRequestContext,
    strategy: string,
    data: SocialSignInData,
  ): Promise<any>;
}
