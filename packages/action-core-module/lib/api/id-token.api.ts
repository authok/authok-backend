import { BaseApi } from "./base.api";
import { IEventManager } from "../event";
import { ICommandBus } from "../command";
import { SetCustomClaimCommand } from "./commands";

export class IdTokenApi extends BaseApi {
  constructor(eventManager: IEventManager, commandBus: ICommandBus) {
    super(eventManager, commandBus);
  }

  setCustomClaim(key: string, value: string) {
    this.commandBus.push(new SetCustomClaimCommand('idToken', key, value));
  }
}