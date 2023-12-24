import { BaseApi } from "./base.api";
import { IEventManager } from "../event";
import { ICommandBus } from "../command";
export declare class IdTokenApi extends BaseApi {
    constructor(eventManager: IEventManager, commandBus: ICommandBus);
    setCustomClaim(key: string, value: string): void;
}
