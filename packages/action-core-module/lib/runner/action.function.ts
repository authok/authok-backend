import { Injectable, NotFoundException } from '@nestjs/common';
import { TriggerEvent } from '../model';
import { TriggerFunction } from './func_types';
import { ScriptManager } from '../script/script.manager';
import { VM2Sandbox } from '../sandbox/vm2.sandbox';
import { Writable } from 'stream';

export type LogListener = (type: string, out: string) => void;
export type ErrorListener = (err: Error) => void;

export class ActionFunction {
  private logListeners: LogListener[];
  private errorListeners: ErrorListener[];

  constructor(private readonly scriptManager: ScriptManager) {
    this.logListeners = [];
    this.errorListeners = [];
  }

  onError(listener: (err: Error) => void): this {
    this.errorListeners.push(listener);
    return this;
  }

  onLog(listener: LogListener): this {
    this.logListeners.push(listener);
    return this;
  }

  async invoke(
    action: string,
    funcName: string,
    event: TriggerEvent,
    ...args: any[]
  ) {
    let actionCode;
    if (event.code) {
      actionCode = event.code;
    } else {
      actionCode = await this.scriptManager.get(action);
    }

    if (!actionCode)
      throw new NotFoundException(`code for action ${action} not found`);

    const stdoutStream = new Writable();

    stdoutStream.write = (chunk, encoding, callback?): boolean => {
      this.logListeners.forEach((it) => it('stdout', chunk));
      return true;
    };

    const stderrStream = new Writable();
    stderrStream.write = (chunk, encoding, callback?): boolean => {
      this.logListeners.forEach((it) => it('stdout', chunk));
      return true;
    };

    const logger = new console.Console(stdoutStream, stderrStream);

    const sandbox = new VM2Sandbox({
      sandbox: {
        console: logger,
      },
    });

    const actionMod = await sandbox.run<TriggerFunction>(actionCode);
    if (!actionMod)
      throw new NotFoundException(`module ${actionMod} not found`);

    const func = actionMod[funcName];
    if (!func) throw new NotFoundException(`function ${funcName} not found`);

    await func(event, ...args);
  }
}
