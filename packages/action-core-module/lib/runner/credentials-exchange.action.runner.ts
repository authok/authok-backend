import { Injectable } from '@nestjs/common';
import { TriggerEvent, TriggerResult } from '../model';
import { CredentialsExchangeApi } from '../api';
import { EventManager } from '../event';
import { CommandBus } from '../command';
import { ActionInvoker } from './action.invoker';
import { ScriptManager } from '../script/script.manager';
import { IActionRunner } from './action.runner';

@Injectable()
export class CredentailsExchangeActionRunner implements IActionRunner {
  constructor(private readonly scriptManager: ScriptManager) {}

  async run(funcName: string, event: TriggerEvent): Promise<TriggerResult> {
    const eventManager = new EventManager(event);
    const commandBus = new CommandBus();
    const api = new CredentialsExchangeApi(eventManager, commandBus);

    return new ActionInvoker(this.scriptManager)
      .commandBus(commandBus)
      .invoke('m2m', funcName || 'onExecuteCredentialsExchange', event, api);
  }
}
