import { TriggerResult, TriggerEvent } from '../model';
import { IActionRunner } from '../runner/action.runner';
export declare class ActionService {
    private actionRunners;
    constructor(actionRunners: Record<string, IActionRunner>);
    run(trigger: string, funcName: string, event: TriggerEvent): Promise<TriggerResult>;
}
