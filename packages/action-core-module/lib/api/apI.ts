import * as _ from 'lodash';
import { ICommandBus } from '../command';
import { IEventManager } from '../event';
import { RedirectApi } from './redirect.api';
import { AccessApi } from './access.api';
import { UserApi } from './user.api';
import { IdTokenApi } from './id-token.api';
import { AccessTokenApi } from './access-token.api';

export class PostLoginApi {
  redirect: RedirectApi;
  user: UserApi;
  access: AccessApi;
  idToken: IdTokenApi;
  accessToken: AccessTokenApi;

  constructor(eventManager: IEventManager, commandBus: ICommandBus) {
    this.redirect = new RedirectApi(eventManager, commandBus);
    this.user = new UserApi(eventManager, commandBus);
    this.access = new AccessApi(eventManager, commandBus);
    this.idToken = new IdTokenApi(eventManager, commandBus);
    this.accessToken = new AccessTokenApi(eventManager, commandBus);
  }
}

export class CredentialsExchangeApi {
  accessToken: AccessTokenApi;
  access: AccessApi;
  // cache: CacheApi;

  constructor(eventManager: IEventManager, commandBus: ICommandBus) {
    this.accessToken = new AccessTokenApi(eventManager, commandBus);
  }
}
