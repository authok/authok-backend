import { Provider } from '@authok/oidc-provider';
import { Injectable } from '@nestjs/common';
import { IContext } from '@libs/nest-core';
import { IExtension } from '../extention';

@Injectable()
export class TokenPipelineExtension implements IExtension<Provider> {
  constructor(
  ) {}
  
  extend(ctx: IContext, provider: Provider) {
  }
}