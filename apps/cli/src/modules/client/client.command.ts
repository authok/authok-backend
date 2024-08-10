import { Inject, Injectable } from '@nestjs/common';
import { Command, Positional, Option } from 'nestjs-command';
import { IClientService } from 'libs/api/infra-api/src';

@Injectable()
export class ClientCommand {
  constructor(
    @Inject('IClientService')
    private readonly clientService: IClientService,
  ) {}

  @Command({
    command: 'list:clients <tenant>',
    describe: 'List clients',
  })
  async paginate(
    @Positional({
      name: 'tenant',
      describe: 'tenant',
      type: 'string',
    })
    tenant: string,
    @Option({
      name: 'page',
      describe: 'Page',
      type: 'number',
      alias: 'page',
      default: 0,
    })
    page: number,
    @Option({
      name: 'per_page',
      describe: 'PageSize',
      type: 'number',
      alias: 'per_page',
      default: 20,
    })
    per_page: number,
  ) {
    return await this.clientService.paginate({ tenant }, {
        page,
        per_page,
    });
  }

  @Command({
    command: 'create:client <tenant> <json>',
    describe: 'Create a client',
  })
  async create(
    @Positional({
      name: 'tenant',
      describe: 'tenant',
      type: 'string',
    })
    tenant: string,
    @Positional({
      name: 'json',
      describe: 'json data',
      type: 'string',
    })
    json: string,
  ) {
    const data = JSON.parse(json);
    return await this.clientService.create({ tenant }, data);
  }
}
