import { ICommandBus } from "../command";
import { IEventManager } from "../event";
import { BaseApi } from "./base.api";
import { RequireMultifactorAuthCommand } from "./commands";


export class MultifactorApi extends BaseApi {
  constructor(eventManager: IEventManager, commandBus: ICommandBus) {
    super(eventManager, commandBus);
  }

  enable(provider: string, options) {
    this.commandBus.push(new RequireMultifactorAuthCommand(provider, options));
  }
}