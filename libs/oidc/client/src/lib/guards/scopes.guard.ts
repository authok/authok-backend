import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Allow access if user has at least one of the specified scopes
 * Must be put after AuthGuard('jwt')
 */
@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const scopes = this.reflector.get<string[]>('scopes', context.getHandler());
    if (!scopes) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userScope: string = request.user && request.user.scope; //as a string e.g: 'create:user update:user'
    // console.log('userScope: ', userScope, scopes);
    if (!userScope) {
      //if there is no user or no scope associated with user
      return false;
    }

    const userScopes: string[] = userScope.split(' '); //split scope string to array of scopes

    return scopes.every((elem) => userScopes.includes(elem)); //check if array has required scope
  }
}
