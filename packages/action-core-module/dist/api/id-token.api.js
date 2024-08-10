"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdTokenApi = void 0;
const base_api_1 = require("./base.api");
const commands_1 = require("./commands");
class IdTokenApi extends base_api_1.BaseApi {
    constructor(eventManager, commandBus) {
        super(eventManager, commandBus);
    }
    setCustomClaim(key, value) {
        this.commandBus.push(new commands_1.SetCustomClaimCommand('idToken', key, value));
    }
}
exports.IdTokenApi = IdTokenApi;
//# sourceMappingURL=id-token.api.js.map