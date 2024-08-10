"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireMultifactorAuthCommand = exports.RedirectPromptCommand = exports.SetCustomClaimCommand = exports.AccessDeniedCommand = exports.SetMetadataCommand = exports.CommandTypes = void 0;
const command_1 = require("../command");
var CommandTypes;
(function (CommandTypes) {
    CommandTypes["SetMetadata"] = "SetMetadata";
    CommandTypes["RedirectPrompt"] = "RedirectPrompt";
    CommandTypes["RequireMultifactorAuth"] = "RequireMultifactorAuth";
    CommandTypes["AccessDenied"] = "AccessDenied";
    CommandTypes["SetCustomClaim"] = "SetCustomClaim";
})(CommandTypes || (exports.CommandTypes = CommandTypes = {}));
class SetMetadataCommand extends command_1.BaseCommand {
    constructor(target, key, value) {
        super(CommandTypes.SetMetadata, {
            target,
            key,
            value,
        });
    }
}
exports.SetMetadataCommand = SetMetadataCommand;
class AccessDeniedCommand extends command_1.BaseCommand {
    constructor(reason) {
        super(CommandTypes.AccessDenied, reason);
    }
}
exports.AccessDeniedCommand = AccessDeniedCommand;
class SetCustomClaimCommand extends command_1.BaseCommand {
    constructor(target, name, value) {
        super(CommandTypes.SetCustomClaim, {
            target,
            name,
            value,
        });
    }
}
exports.SetCustomClaimCommand = SetCustomClaimCommand;
class RedirectPromptCommand extends command_1.BaseCommand {
    constructor(url, resumeFn) {
        super(CommandTypes.RedirectPrompt, {
            url,
            resumeFn,
        });
    }
}
exports.RedirectPromptCommand = RedirectPromptCommand;
class RequireMultifactorAuthCommand extends command_1.BaseCommand {
    constructor(provider, options) {
        super(CommandTypes.RequireMultifactorAuth, {
            provider,
            options,
        });
    }
}
exports.RequireMultifactorAuthCommand = RequireMultifactorAuthCommand;
//# sourceMappingURL=commands.js.map