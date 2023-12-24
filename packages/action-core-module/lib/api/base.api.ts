import { IEventManager } from '../event';
import { ICommandBus } from '../command';

export class BaseApi {
  protected eventManager: IEventManager;
  protected commandBus: ICommandBus;

  constructor(eventManager: IEventManager, commandBus: ICommandBus) {
    this.eventManager = eventManager;
    this.commandBus = commandBus;
  }
}