"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBus = exports.BaseCommand = void 0;
class BaseCommand {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}
exports.BaseCommand = BaseCommand;
class CommandBus {
    constructor() {
        this._commands = new Array();
    }
    get commands() {
        return this._commands;
    }
    push(cmd) {
        this._commands.push(cmd);
    }
}
exports.CommandBus = CommandBus;
//# sourceMappingURL=command.js.map