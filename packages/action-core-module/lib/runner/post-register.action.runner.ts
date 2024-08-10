import { Injectable } from '@nestjs/common';
import { TriggerEvent, TriggerResult } from '../model';
import { CommandBus } from '../command';
import { ActionInvoker } from './action.invoker';
import { ScriptManager } from '../script/script.manager';
import { IActionRunner } from './action.runner';

@Injectable()
export class PostRegisterActionRunner implements IActionRunner {
  constructor(private readonly scriptManager: ScriptManager) {}

  async run(funcName: string, event: TriggerEvent): Promise<TriggerResult> {
    const commandBus = new CommandBus();

    return new ActionInvoker(this.scriptManager)
      .commandBus(commandBus)
      .invoke('post-register', funcName || 'onPostUserRegister', event);
  }
}
