import { ICommandBus } from "../command";
import { IEventManager } from "../event";
import { BaseApi } from "./base.api";
export declare class MultifactorApi extends BaseApi {
    constructor(eventManager: IEventManager, commandBus: ICommandBus);
    enable(provider: string, options: any): void;
}
