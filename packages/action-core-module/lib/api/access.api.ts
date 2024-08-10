import { IEventManager } from "../event";
import { ICommandBus } from "../command";
import { BaseApi } from "./base.api";
import { AccessDeniedCommand } from "./commands";

export class AccessApi extends BaseApi {
  constructor(eventManager: IEventManager, commandBus: ICommandBus) {
    super(eventManager, commandBus);
  }

  deny(reason: string) {
    this.commandBus.push(new AccessDeniedCommand(reason))
  }
}