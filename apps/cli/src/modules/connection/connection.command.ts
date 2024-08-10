import { Inject, Injectable } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import { IConnectionService } from 'libs/api/infra-api/src';

@Injectable()
export class ConnectionCommand {
  constructor(
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
  ) {}

  @Command({
    command: 'list:connections',
    describe: '翻页查询',

  })
  async paginate(
    @Positional({
      name: 'tenant',
      describe: 'tenant',
      type: 'string',
    })
    tenant: string,
  ) {
    return await this.connectionService.paginate({ tenant }, {
      strategy: ['sms', 'email'],
    });
  }
}
