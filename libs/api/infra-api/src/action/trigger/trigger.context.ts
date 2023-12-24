import { IWebRequest, TriggerEvent, IError } from '@authok/action-core-module';
import { ICommand } from '@authok/action-core-module';

export type CommandListener = (command: ICommand) => Promise<void>;
export type CheckpointFn = (
  command: ICommand,
  actionIndex: number,
) => Promise<void> | void;
export type ErrorFn = (errors: IError[]) => void;

export interface TriggerCheckpoint {
  trigger: string;
  index: number;
  resumeFn: string;
  interaction: string; // 会话ID
  event: any;
  [key: string]: any;
}

export class TriggerContext {
  exp: number;
  trigger: string;
  event: any;
  interaction: string;
  checkpoint: TriggerCheckpoint;
  request: IWebRequest;
  commandListeners: Record<string, CommandListener> = {};
  onErrors: ErrorFn;
  onCheckpoint: CheckpointFn;
  onFinish: () => void;
}

export class TriggerContextBuilder {
  private ref = new TriggerContext();

  interaction(interaction: string): this {
    this.ref.interaction = interaction;
    return this;
  }

  trigger(trigger: string): this {
    this.ref.trigger = trigger;
    return this;
  }

  checkpoint(checkpoint: TriggerCheckpoint): this {
    this.ref.checkpoint = checkpoint;
    return this;
  }

  exp(exp: number): this {
    this.ref.exp = exp;
    return this;
  }

  request(request: IWebRequest): this {
    this.ref.request = request;
    return this;
  }

  onErrors(fn: ErrorFn): this {
    this.ref.onErrors = fn;
    return this;
  }

  onCommand(type: string, listener: CommandListener): this {
    this.ref.commandListeners[type] = listener;
    return this;
  }

  onCheckpoint(fn: CheckpointFn): this {
    this.ref.onCheckpoint = fn;
    return this;
  }

  onFinish(fn: () => void): this {
    this.ref.onFinish = fn;
    return this;
  }

  event(event: any): this {
    this.ref.event = event;
    return this;
  }

  build(): TriggerContext {
    return this.ref;
  }
}

export class ActionContext {
  event: TriggerEvent;
  trigger: string;
  func: string;
  onCheckpoint: CheckpointFn;
  commandListeners: Record<string, CommandListener> = {};
  onErrors: ErrorFn;
}

export class ActionContextBuilder {
  private ref = new ActionContext();

  onCommand(type: string, listener: CommandListener): this {
    this.ref.commandListeners[type] = listener;
    return this;
  }

  onCheckpoint(fn: CheckpointFn): this {
    this.ref.onCheckpoint = fn;
    return this;
  }

  onErrors(fn: ErrorFn): this {
    this.ref.onErrors = fn;
    return this;
  }

  event(event: TriggerEvent): this {
    this.ref.event = event;
    return this;
  }

  trigger(trigger: string): this {
    this.ref.trigger = trigger;
    return this;
  }

  func(func: string): this {
    this.ref.func = func;
    return this;
  }

  build(): ActionContext {
    return this.ref;
  }
}
