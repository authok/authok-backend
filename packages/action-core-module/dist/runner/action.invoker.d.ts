import { ICommandBus } from '../command';
import { TriggerResult, TriggerEvent } from '../model';
import { ScriptManager } from '../script/script.manager';
export declare class ActionInvoker {
    private scriptManager;
    private _commandBus;
    constructor(scriptManager: ScriptManager);
    commandBus(commandBus: ICommandBus): this;
    invoke(mod: string, funcName: string, event: TriggerEvent, ...args: any[]): Promise<TriggerResult>;
}
