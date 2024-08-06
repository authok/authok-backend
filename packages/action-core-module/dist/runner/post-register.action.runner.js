"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRegisterActionRunner = void 0;
const common_1 = require("@nestjs/common");
const command_1 = require("../command");
const action_invoker_1 = require("./action.invoker");
const script_manager_1 = require("../script/script.manager");
let PostRegisterActionRunner = class PostRegisterActionRunner {
    constructor(scriptManager) {
        this.scriptManager = scriptManager;
    }
    async run(funcName, event) {
        const commandBus = new command_1.CommandBus();
        return new action_invoker_1.ActionInvoker(this.scriptManager)
            .commandBus(commandBus)
            .invoke('post-register', funcName || 'onPostUserRegister', event);
    }
};
exports.PostRegisterActionRunner = PostRegisterActionRunner;
exports.PostRegisterActionRunner = PostRegisterActionRunner = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [script_manager_1.ScriptManager])
], PostRegisterActionRunner);
//# sourceMappingURL=post-register.action.runner.js.map