"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ActionModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionModule = void 0;
const common_1 = require("@nestjs/common");
const action_service_1 = require("./service/action.service");
const post_login_action_runner_1 = require("./runner/post-login.action.runner");
const path = require("path");
const script_manager_1 = require("./script/script.manager");
const post_register_action_runner_1 = require("./runner/post-register.action.runner");
const credentials_exchange_action_runner_1 = require("./runner/credentials-exchange.action.runner");
let ActionModule = ActionModule_1 = class ActionModule {
    static register(options) {
        return {
            module: ActionModule_1,
            imports: [],
            providers: [
                action_service_1.ActionService,
                post_login_action_runner_1.PostLoginActionRunner,
                post_register_action_runner_1.PostRegisterActionRunner,
                credentials_exchange_action_runner_1.CredentailsExchangeActionRunner,
                {
                    provide: script_manager_1.ScriptManager,
                    useFactory: async () => {
                        return new script_manager_1.ScriptManager(options.scriptPath || path.join(process.cwd(), 'actions'));
                    },
                },
                {
                    provide: 'action_runners',
                    useFactory: (postLogin, postRegister, m2m) => ({
                        'post-login': postLogin,
                        'post-register': postRegister,
                        m2m,
                    }),
                    inject: [
                        post_login_action_runner_1.PostLoginActionRunner,
                        post_register_action_runner_1.PostRegisterActionRunner,
                        credentials_exchange_action_runner_1.CredentailsExchangeActionRunner,
                    ],
                },
            ],
            exports: [action_service_1.ActionService, script_manager_1.ScriptManager],
        };
    }
};
exports.ActionModule = ActionModule;
exports.ActionModule = ActionModule = ActionModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [
            action_service_1.ActionService,
            post_login_action_runner_1.PostLoginActionRunner,
            post_register_action_runner_1.PostRegisterActionRunner,
            credentials_exchange_action_runner_1.CredentailsExchangeActionRunner,
            {
                provide: script_manager_1.ScriptManager,
                useFactory: async () => {
                    return new script_manager_1.ScriptManager(path.join(process.cwd(), 'actions'));
                },
            },
            {
                provide: 'action_runners',
                useFactory: (postLogin, postRegister, m2m) => ({
                    'post-login': postLogin,
                    'post-register': postRegister,
                    m2m,
                }),
                inject: [
                    post_login_action_runner_1.PostLoginActionRunner,
                    post_register_action_runner_1.PostRegisterActionRunner,
                    credentials_exchange_action_runner_1.CredentailsExchangeActionRunner,
                ],
            },
        ],
        exports: [action_service_1.ActionService, script_manager_1.ScriptManager],
    })
], ActionModule);
//# sourceMappingURL=action.module.js.map