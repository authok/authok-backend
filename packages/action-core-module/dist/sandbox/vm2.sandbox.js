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
exports.VM2Sandbox = void 0;
const common_1 = require("@nestjs/common");
const vm2_1 = require("vm2");
let VM2Sandbox = class VM2Sandbox {
    constructor(options) {
        this.vm = new vm2_1.NodeVM({
            timeout: 5000,
            eval: false,
            sandbox: {
                ...options === null || options === void 0 ? void 0 : options.sandbox,
            },
            require: {
                external: true,
                builtin: options === null || options === void 0 ? void 0 : options.builtin,
                root: './',
                mock: {
                    fs: {},
                },
            },
        });
    }
    async run(code) {
        return await this.vm.run(code, 'node_modules');
    }
    on(eventName, listener) {
        this.vm.on(eventName, listener);
        return this;
    }
};
exports.VM2Sandbox = VM2Sandbox;
exports.VM2Sandbox = VM2Sandbox = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], VM2Sandbox);
//# sourceMappingURL=vm2.sandbox.js.map