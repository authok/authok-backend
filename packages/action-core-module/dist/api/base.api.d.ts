import { IEventManager } from '../event';
import { ICommandBus } from '../command';
export declare class BaseApi {
    protected eventManager: IEventManager;
    protected commandBus: ICommandBus;
    constructor(eventManager: IEventManager, commandBus: ICommandBus);
}
