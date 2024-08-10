import { IEventManager } from '../event';
import { ICommandBus } from '../command';
import { BaseApi } from './base.api';
import { SetCustomClaimCommand } from './commands';

export class AccessTokenApi extends BaseApi {
  constructor(eventManager: IEventManager, commandBus: ICommandBus) {
    super(eventManager, commandBus);
  }

  setCustomClaim(name: string, value: string) {
    this.commandBus.push(new SetCustomClaimCommand('accessToken', name, value));
  }
}
