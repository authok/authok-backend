import { TriggerEvent } from '../model';
import { ScriptManager } from '../script/script.manager';
export type LogListener = (type: string, out: string) => void;
export type ErrorListener = (err: Error) => void;
export declare class ActionFunction {
    private readonly scriptManager;
    private logListeners;
    private errorListeners;
    constructor(scriptManager: ScriptManager);
    onError(listener: (err: Error) => void): this;
    onLog(listener: LogListener): this;
    invoke(action: string, funcName: string, event: TriggerEvent, ...args: any[]): Promise<void>;
}
