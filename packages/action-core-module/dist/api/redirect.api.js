"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectApi = void 0;
const _ = require("lodash");
const base_api_1 = require("./base.api");
const url_1 = require("url");
const commands_1 = require("./commands");
const jwt = require("jsonwebtoken");
const DEFAULT_SESSION_TOKEN_QUERY_PARAM = 'session_token';
const NO_REDIRECT_PROTOCOLS = [];
class RedirectApi extends base_api_1.BaseApi {
    constructor(eventManager, commandBus) {
        super(eventManager, commandBus);
    }
    sendUserTo(baseUrl, urlOptions) {
        if (!this.canRedirect()) {
            const event = this.eventManager.getEvent();
            console.log(`Redirecting is not possible in a '${event.transaction && event.transaction.protocol}' flow or when prompt=none. Skipping redirect.`);
            return;
        }
        const url = new url_1.URL(baseUrl);
        if (urlOptions == null ? void 0 : urlOptions.query) {
            for (const param in urlOptions.query) {
                url.searchParams.set(param, urlOptions.query[param]);
            }
        }
        this.commandBus.push(new commands_1.RedirectPromptCommand(url.href, 'onContinuePostLogin'));
    }
    encodeToken(options) {
        const event = this.eventManager.getEvent();
        let payload = _.merge(options.payload, {
            sub: event.user.user_id,
            iss: event.request.hostname,
            ip: event.request.ip,
        });
        payload = _.merge({
            exp: Math.floor(Date.now() / 1000) + (60 * 10),
        }, payload);
        return jwt.sign(payload, options.secret);
    }
    async validateToken(options) {
        options.tokenParamName || (options.tokenParamName = DEFAULT_SESSION_TOKEN_QUERY_PARAM);
        const event = this.eventManager.getEvent();
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
    canRedirect() {
        const event = this.eventManager.getEvent();
        const queryParams = event.request.query;
        if (queryParams.prompt === "none") {
            return false;
        }
        return !NO_REDIRECT_PROTOCOLS.includes(event.transaction && event.transaction.protocol || "unknown-protocol");
    }
}
exports.RedirectApi = RedirectApi;
//# sourceMappingURL=redirect.api.js.map