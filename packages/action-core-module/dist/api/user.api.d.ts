import { BaseApi } from "./base.api";
import { IEventManager } from "../event";
import { ICommandBus } from '../command';
export declare class UserApi extends BaseApi {
    constructor(eventManager: IEventManager, commandBus: ICommandBus);
    setAppMetadata(key: string, value: string): void;
    setUserMetadata(key: string, value: string): void;
}
