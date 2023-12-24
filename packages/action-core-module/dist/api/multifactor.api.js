"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultifactorApi = void 0;
const base_api_1 = require("./base.api");
const commands_1 = require("./commands");
class MultifactorApi extends base_api_1.BaseApi {
    constructor(eventManager, commandBus) {
        super(eventManager, commandBus);
    }
    enable(provider, options) {
        this.commandBus.push(new commands_1.RequireMultifactorAuthCommand(provider, options));
    }
}
exports.MultifactorApi = MultifactorApi;
//# sourceMappingURL=multifactor.api.js.map