"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenApi = void 0;
const base_api_1 = require("./base.api");
const commands_1 = require("./commands");
class AccessTokenApi extends base_api_1.BaseApi {
    constructor(eventManager, commandBus) {
        super(eventManager, commandBus);
    }
    setCustomClaim(name, value) {
        this.commandBus.push(new commands_1.SetCustomClaimCommand('accessToken', name, value));
    }
}
exports.AccessTokenApi = AccessTokenApi;
//# sourceMappingURL=access-token.api.js.map