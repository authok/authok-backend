import { Injectable, Inject, Logger } from '@nestjs/common';
import { IConfiguration } from '../configuration.builder';
import { IClientGrantService } from 'libs/api/infra-api/src';
import { IExtension } from '../../extention';
import { IContext } from '@libs/nest-core';

@Injectable()
export class ClientGrantExtension implements IExtension<IConfiguration> {
  constructor(
    @Inject('IClientGrantService')
    private readonly clientGrantService: IClientGrantService,
  ) {}

  extend(ctx: IContext, configuration: IConfiguration) {
    const loadClientGrantScopes = async (ctx, client, audience) => {
      console.log('loadClientGrantScopes: ', client.clientId, audience);
      const clientGrant = await this.clientGrantService.findByClientAndAudience(
        {
          tenant: client.tenant,
        },
        client.clientId,
        audience,
      );
      if (!clientGrant) return [];

      return clientGrant.scope;
    };

    configuration.set('loadClientGrantScopes', loadClientGrantScopes);
  }
}
