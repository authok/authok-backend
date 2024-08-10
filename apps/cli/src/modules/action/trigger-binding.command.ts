import { Inject, Injectable } from '@nestjs/common';
import { Command, Positional } from 'nestjs-command';
import { ITriggerBindingService } from 'libs/api/infra-api/src';

@Injectable()
export class TriggerBindingCommand {
  constructor(
    @Inject('ITriggerBindingService')
    private readonly triggerBindingService: ITriggerBindingService,
  ) {}

  @Command({
    command: 'list:trigger-bindings',
    describe: '翻页查询触发器绑定',

  })
  async paginate(
    @Positional({
      name: 'tenant',
      describe: 'tenant',
      type: 'string',
    })
    tenant: string,
    @Positional({
      name: 'trigger_id',
      describe: 'trigger_id',
      type: 'string',
    })
    trigger_id: string,
  ) {
    const page = await this.triggerBindingService.paginate({ tenant }, {
      trigger_id
    });
    console.log(page);
  }
}
