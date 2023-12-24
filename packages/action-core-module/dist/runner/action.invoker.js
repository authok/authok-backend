"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionInvoker = void 0;
const model_1 = require("../model");
const action_function_1 = require("./action.function");
const common_1 = require("@nestjs/common");
const MAX_LOG_SIZE = 1024 * 10;
class ActionInvoker {
    constructor(scriptManager) {
        this.scriptManager = scriptManager;
    }
    commandBus(commandBus) {
        this._commandBus = commandBus;
        return this;
    }
    async invoke(mod, funcName, event, ...args) {
        const logs = [];
        const errors = [];
        let logSize = 0;
        common_1.Logger.debug(`执行action: mod: ${mod}, func: ${funcName}`);
        try {
            await new action_function_1.ActionFunction(this.scriptManager)
                .onLog((method, out) => {
                if (logSize < MAX_LOG_SIZE) {
                    logSize += out.length;
                    logs.push([method, out]);
                }
            })
                .invoke(mod, funcName, event, ...args);
        }
        catch (e) {
            errors.push({
                name: e.constructor.name,
                message: e.message,
                stack: e.stack,
            });
        }
        const result = new model_1.TriggerResult();
        result.logs = logs;
        result.errors = errors;
        result.commands = this._commandBus.commands;
        return result;
    }
}
exports.ActionInvoker = ActionInvoker;
//# sourceMappingURL=action.invoker.js.map