import { Request, Response } from 'express';
import { IRequestContext } from '@libs/nest-core';
import { SocialSignInData } from './authorization.manager';

export interface IAuthorizationHandler {
  authorize(ctx: IRequestContext, req: Request, res: Response): Promise<void>;
}

export interface ISocialAuthorizationHandler extends IAuthorizationHandler {
  oauthSignIn(ctx: IRequestContext, data: SocialSignInData): Promise<any>;
}
