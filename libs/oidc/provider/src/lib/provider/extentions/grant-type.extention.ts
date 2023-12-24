import { Provider } from '@authok/oidc-provider';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { IGrantTypeHandler } from '../../grant-types/grant_type.handler';
import { IContext } from '@libs/nest-core';
import { IExtension } from '../extention';

@Injectable()
export class GrantTypeExtension implements IExtension<Provider> {
  constructor(
    @Inject('GrantTypeHandlers')
    private readonly grantTypeHandlers: Set<IGrantTypeHandler>,
  ) {}
  
  extend(ctx: IContext, provider: Provider) {
    // 参考 https://github.com/panva/node-oidc-provider/blob/v5.5.5/docs/configuration.md

    this.grantTypeHandlers.forEach((it) => {
      Logger.log(`注册 grant_type: ${it.name}`);
      provider.registerGrantType(
        it.name,
        it.handler(provider),
        it.params,
        it.dupes,
      );
    });
  }
}