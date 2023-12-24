"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessApi = void 0;
const base_api_1 = require("./base.api");
const commands_1 = require("./commands");
class AccessApi extends base_api_1.BaseApi {
    constructor(eventManager, commandBus) {
        super(eventManager, commandBus);
    }
    deny(reason) {
        this.commandBus.push(new commands_1.AccessDeniedCommand(reason));
    }
}
exports.AccessApi = AccessApi;
//# sourceMappingURL=access.api.js.map