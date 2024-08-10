import { BaseApi } from './base.api';
import { IEventManager } from '../event';
import { ICommandBus } from '../command';
export declare class RedirectApi extends BaseApi {
    constructor(eventManager: IEventManager, commandBus: ICommandBus);
    sendUserTo(baseUrl: string, urlOptions?: any): void;
    encodeToken(options: Record<string, any>): any;
    validateToken(options: Record<string, any>): Promise<any>;
    canRedirect(): boolean;
}
