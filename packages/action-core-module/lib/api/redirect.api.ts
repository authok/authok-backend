import * as _ from 'lodash';
import { BaseApi } from './base.api';
import { IEventManager } from '../event';
import { ICommandBus } from '../command';
import { TriggerEvent } from '../model';
import { URL } from 'url';
import { RedirectPromptCommand } from './commands';
import * as jwt from 'jsonwebtoken';

const DEFAULT_SESSION_TOKEN_QUERY_PARAM = 'session_token';
const NO_REDIRECT_PROTOCOLS = [];

export class RedirectApi extends BaseApi {
  constructor(eventManager: IEventManager, commandBus: ICommandBus) {
    super(eventManager, commandBus);  
  }

  sendUserTo(baseUrl: string, urlOptions?: any) {
    if (!this.canRedirect()) {
      const event = this.eventManager.getEvent<TriggerEvent>();
      console.log(`Redirecting is not possible in a '${event.transaction && event.transaction.protocol}' flow or when prompt=none. Skipping redirect.`);
      return;
    }

    const url = new URL(baseUrl);
    if (urlOptions == null ? void 0 : urlOptions.query) {
      for (const param in urlOptions.query) {
        url.searchParams.set(param, urlOptions.query[param]);
      }
    }

    this.commandBus.push(new RedirectPromptCommand(url.href, 'onContinuePostLogin'));
  }

  encodeToken(options: Record<string, any>) {
    const event = this.eventManager.getEvent<TriggerEvent>();

    let payload = _.merge(options.payload, {
      sub: event.user.user_id,
      iss: event.request.hostname,
      ip: event.request.ip,
    });

    payload = _.merge({
      exp: Math.floor(Date.now() / 1000) + (60 * 10),
    }, payload);

    return jwt.sign(payload, options.secret)
  }

  async validateToken(options: Record<string, any>) {
    options.tokenParamName || (options.tokenParamName = DEFAULT_SESSION_TOKEN_QUERY_PARAM);

    const event = this.eventManager.getEvent<TriggerEvent>();
    const params = event.request.body;

    const token = params[options.tokenParamName];
    if (!token) {
      throw new Error(`There is no parameter called '${options.tokenParamName}' available in either the POST body or query string.`);
    }

    const response = jwt.verify(token, options.secret, {
      issuer: event.request.hostname,
    });

    console.log('response: ', response);
    return response;
  }

  canRedirect(): boolean {
    const event = this.eventManager.getEvent<TriggerEvent>();
    const queryParams = event.request.query;
    if (queryParams.prompt === "none") {
      return false;
    }
    return !NO_REDIRECT_PROTOCOLS.includes(event.transaction && event.transaction.protocol || "unknown-protocol");
  }
}