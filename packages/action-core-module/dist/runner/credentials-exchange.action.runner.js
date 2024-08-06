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
exports.CredentailsExchangeActionRunner = void 0;
const common_1 = require("@nestjs/common");
const api_1 = require("../api");
const event_1 = require("../event");
const command_1 = require("../command");
const action_invoker_1 = require("./action.invoker");
const script_manager_1 = require("../script/script.manager");
let CredentailsExchangeActionRunner = class CredentailsExchangeActionRunner {
    constructor(scriptManager) {
        this.scriptManager = scriptManager;
    }
    async run(funcName, event) {
        const eventManager = new event_1.EventManager(event);
        const commandBus = new command_1.CommandBus();
        const api = new api_1.CredentialsExchangeApi(eventManager, commandBus);
        return new action_invoker_1.ActionInvoker(this.scriptManager)
            .commandBus(commandBus)
            .invoke('m2m', funcName || 'onExecuteCredentialsExchange', event, api);
    }
};
exports.CredentailsExchangeActionRunner = CredentailsExchangeActionRunner;
exports.CredentailsExchangeActionRunner = CredentailsExchangeActionRunner = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [script_manager_1.ScriptManager])
], CredentailsExchangeActionRunner);
//# sourceMappingURL=credentials-exchange.action.runner.js.map