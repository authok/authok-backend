"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsExchangeApi = exports.PostLoginApi = void 0;
const redirect_api_1 = require("./redirect.api");
const access_api_1 = require("./access.api");
const user_api_1 = require("./user.api");
const id_token_api_1 = require("./id-token.api");
const access_token_api_1 = require("./access-token.api");
class PostLoginApi {
    constructor(eventManager, commandBus) {
        this.redirect = new redirect_api_1.RedirectApi(eventManager, commandBus);
        this.user = new user_api_1.UserApi(eventManager, commandBus);
        this.access = new access_api_1.AccessApi(eventManager, commandBus);
        this.idToken = new id_token_api_1.IdTokenApi(eventManager, commandBus);
        this.accessToken = new access_token_api_1.AccessTokenApi(eventManager, commandBus);
    }
}
exports.PostLoginApi = PostLoginApi;
class CredentialsExchangeApi {
    constructor(eventManager, commandBus) {
        this.accessToken = new access_token_api_1.AccessTokenApi(eventManager, commandBus);
    }
}
exports.CredentialsExchangeApi = CredentialsExchangeApi;
//# sourceMappingURL=api.js.map