import { Inject, Injectable } from '@nestjs/common';
import { Command, Option } from 'nestjs-command';
import { IOrganizationService } from 'libs/api/infra-api/src';

@Injectable()
export class OrganizationCommand {
  constructor(
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,
  ) {}

  @Command({
    command: 'list:organizations',
    describe: 'List Organizations',
  })
  async listOrganizations(
    @Option({
      name: 'tenant',
      describe: '名称',
      type: 'string',
      alias: 'tenant',
      required: true
    })
    tenant: string,
  ) {
    const page = await this.organizationService.paginate({ tenant }, {});

    console.log('page: ', page);
  }

  @Command({
    command: 'organization:enabled_connections',
    describe: '获取组织开启的身份源',
  })
  async enabledConnections(
    @Option({
      name: 'tenant',
      describe: '名称',
      type: 'string',
      alias: 'tenant',
      required: true
    })
    tenant: string,
    @Option({
      name: 'org_id',
      describe: '组织',
      type: 'string',
      alias: 'org',
      required: true,
    })
    org_id: string,
  ) {
    const page = await this.organizationService.enabledConnections({ tenant }, org_id);
  
    console.log('page: ', page);
  }
}