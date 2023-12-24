import { SetMetadataCommand } from "./commands";
import { BaseApi } from "./base.api";
import { IEventManager } from "../event";
import { ICommandBus } from '../command';

export class UserApi extends BaseApi {
  constructor(eventManager: IEventManager, commandBus: ICommandBus) {
    super(eventManager, commandBus);
  }

  setAppMetadata(key: string, value: string) {
    this.commandBus.push(new SetMetadataCommand('application', key, value));
  }

  setUserMetadata(key: string, value: string) {
    this.commandBus.push(new SetMetadataCommand('user', key, value));
  }
}