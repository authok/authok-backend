import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TriggerResult, TriggerEvent } from '../model';
import { IActionRunner } from '../runner/action.runner';

@Injectable()
export class ActionService {
  constructor(
    @Inject('action_runners')
    private actionRunners: Record<string, IActionRunner>,
  ) {}

  async run(
    trigger: string,
    funcName: string,
    event: TriggerEvent,
  ): Promise<TriggerResult> {
    const runner = this.actionRunners[trigger];
    if (!runner) throw new NotFoundException(`action for ${trigger} not found`);

    return await runner.run(funcName, event);
  }
}
