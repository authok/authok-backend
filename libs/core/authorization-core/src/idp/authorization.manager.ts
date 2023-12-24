import { NotFoundException, Logger } from '@nestjs/common';
import {
  IAuthorizationManager,
  SocialSignInData,
} from 'libs/api/authorization-api/src/authorization.manager';
import {
  IAuthorizationHandler,
  ISocialAuthorizationHandler,
} from 'libs/api/authorization-api/src/authorization.handler';
import { IRequestContext } from '@libs/nest-core';
import { Request, Response } from 'express';

export class AuthorizationManager implements IAuthorizationManager {
  private handlers: Record<string, IAuthorizationHandler> = {};

  register(name: string, handler: IAuthorizationHandler) {
    Logger.debug(
      `注册 IDPHandler, strategy: ${name}, type: ${handler.constructor.name}`,
    );

    this.handlers[name] = handler;
  }

  unregister(name: string) {
    delete this.handlers[name];
  }

  get(name: string): IAuthorizationHandler {
    return this.handlers[name];
  }

  async authorize(
    name: string,
    ctx: IRequestContext,
    req: Request,
    res: Response,
  ): Promise<void> {
    const handler = this.handlers[name];
    if (!handler)
      throw new NotFoundException(`authorization type ${name} not found`);

    return await handler.authorize(ctx, req, res);
  }

  async oauthSignIn(
    ctx: IRequestContext,
    strategy: string,
    data: SocialSignInData,
  ): Promise<any> {
    const handler = this.handlers[strategy];
    if (!handler)
      throw new NotFoundException(
        `authorization strategy ${strategy} not found`,
      );

    if (!('oauthSignIn' in handler)) {
      throw new NotFoundException(
        `strategy ${strategy} is not social strategy`,
      );
    }

    const socialHandler = handler as ISocialAuthorizationHandler;
    return await socialHandler.oauthSignIn(ctx, data);
  }
}
