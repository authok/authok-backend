import { TriggerEvent, TriggerResult } from '../model';
import { ScriptManager } from '../script/script.manager';
import { IActionRunner } from './action.runner';
export declare class PostRegisterActionRunner implements IActionRunner {
    private readonly scriptManager;
    constructor(scriptManager: ScriptManager);
    run(funcName: string, event: TriggerEvent): Promise<TriggerResult>;
}
