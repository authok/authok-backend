import { IEventManager } from "../event";
import { ICommandBus } from "../command";
import { BaseApi } from "./base.api";
export declare class AccessApi extends BaseApi {
    constructor(eventManager: IEventManager, commandBus: ICommandBus);
    deny(reason: string): void;
}
