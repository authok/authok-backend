import { ICommandBus } from '../command';
import { TriggerResult, TriggerEvent } from '../model';
import { ScriptManager } from '../script/script.manager';
import { ActionFunction } from './action.function';
import { Logger } from '@nestjs/common';

const MAX_LOG_SIZE = 1024 * 10;

export class ActionInvoker {
  private _commandBus: ICommandBus;

  constructor(private scriptManager: ScriptManager) {}

  commandBus(commandBus: ICommandBus): this {
    this._commandBus = commandBus;
    return this;
  }

  async invoke(
    mod: string,
    funcName: string,
    event: TriggerEvent,
    ...args: any[]
  ): Promise<TriggerResult> {
    const logs = [];
    const errors = [];

    let logSize = 0;

    Logger.debug(`执行action: mod: ${mod}, func: ${funcName}`);

    try {
      await new ActionFunction(this.scriptManager)
        .onLog((method, out) => {
          if (logSize < MAX_LOG_SIZE) {
            logSize += out.length;
            logs.push([method, out]);
          }
        })
        .invoke(mod, funcName, event, ...args);
    } catch (e) {
      errors.push({
        name: e.constructor.name,
        message: e.message,
        stack: e.stack,
      });
    }

    const result = new TriggerResult();
    result.logs = logs;
    result.errors = errors;
    result.commands = this._commandBus.commands;
    return result;
  }
}
