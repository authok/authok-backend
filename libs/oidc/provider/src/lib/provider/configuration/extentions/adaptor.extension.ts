import { Injectable, Inject } from '@nestjs/common';
import { IConfiguration } from "../configuration.builder";
import { accountAdaptor } from '../../../adapters/account.adaptor';
import { injectAdapter } from '../../../adapters/oidc.adapter';
import { AdapterManager } from '../../../adapters/adapter.manager';
import { IUserService } from 'libs/api/infra-api/src';
import { IExtension } from '../../extention';
import { IContext } from '@libs/nest-core';

@Injectable()
export class AdaptorExtension implements IExtension<IConfiguration> {
  constructor(
    private readonly adapterManager: AdapterManager,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}
  
  extend(ctx: IContext, configuration: IConfiguration) {
    const findAccount = accountAdaptor(this.userService).findAccount;
    const adapter = injectAdapter(this.adapterManager);

    configuration.set('findAccount', findAccount);
    configuration.set('adapter', adapter);
  } 
}