import { TriggerEvent, TriggerResult } from '../model';

export interface IActionRunner {
  run(funcName: string, event: TriggerEvent): Promise<TriggerResult>;
}
