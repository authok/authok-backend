"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserApi = void 0;
const commands_1 = require("./commands");
const base_api_1 = require("./base.api");
class UserApi extends base_api_1.BaseApi {
    constructor(eventManager, commandBus) {
        super(eventManager, commandBus);
    }
    setAppMetadata(key, value) {
        this.commandBus.push(new commands_1.SetMetadataCommand('application', key, value));
    }
    setUserMetadata(key, value) {
        this.commandBus.push(new commands_1.SetMetadataCommand('user', key, value));
    }
}
exports.UserApi = UserApi;
//# sourceMappingURL=user.api.js.map