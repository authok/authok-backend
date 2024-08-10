import { ICommandBus } from '../command';
import { IEventManager } from '../event';
import { RedirectApi } from './redirect.api';
import { AccessApi } from './access.api';
import { UserApi } from './user.api';
import { IdTokenApi } from './id-token.api';
import { AccessTokenApi } from './access-token.api';
export declare class PostLoginApi {
    redirect: RedirectApi;
    user: UserApi;
    access: AccessApi;
    idToken: IdTokenApi;
    accessToken: AccessTokenApi;
    constructor(eventManager: IEventManager, commandBus: ICommandBus);
}
export declare class CredentialsExchangeApi {
    accessToken: AccessTokenApi;
    access: AccessApi;
    constructor(eventManager: IEventManager, commandBus: ICommandBus);
}
