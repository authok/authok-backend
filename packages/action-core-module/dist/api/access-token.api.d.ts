import { IEventManager } from '../event';
import { ICommandBus } from '../command';
import { BaseApi } from './base.api';
export declare class AccessTokenApi extends BaseApi {
    constructor(eventManager: IEventManager, commandBus: ICommandBus);
    setCustomClaim(name: string, value: string): void;
}
