"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionFunction = void 0;
const common_1 = require("@nestjs/common");
const vm2_sandbox_1 = require("../sandbox/vm2.sandbox");
const stream_1 = require("stream");
class ActionFunction {
    constructor(scriptManager) {
        this.scriptManager = scriptManager;
        this.logListeners = [];
        this.errorListeners = [];
    }
    onError(listener) {
        this.errorListeners.push(listener);
        return this;
    }
    onLog(listener) {
        this.logListeners.push(listener);
        return this;
    }
    async invoke(action, funcName, event, ...args) {
        let actionCode;
        if (event.code) {
            actionCode = event.code;
        }
        else {
            actionCode = await this.scriptManager.get(action);
        }
        if (!actionCode)
            throw new common_1.NotFoundException(`code for action ${action} not found`);
        const stdoutStream = new stream_1.Writable();
        stdoutStream.write = (chunk, encoding, callback) => {
            this.logListeners.forEach((it) => it('stdout', chunk));
            return true;
        };
        const stderrStream = new stream_1.Writable();
        stderrStream.write = (chunk, encoding, callback) => {
            this.logListeners.forEach((it) => it('stdout', chunk));
            return true;
        };
        const logger = new console.Console(stdoutStream, stderrStream);
        const sandbox = new vm2_sandbox_1.VM2Sandbox({
            sandbox: {
                console: logger,
            },
        });
        const actionMod = await sandbox.run(actionCode);
        if (!actionMod)
            throw new common_1.NotFoundException(`module ${actionMod} not found`);
        const func = actionMod[funcName];
        if (!func)
            throw new common_1.NotFoundException(`function ${funcName} not found`);
        await func(event, ...args);
    }
}
exports.ActionFunction = ActionFunction;
//# sourceMappingURL=action.function.js.map