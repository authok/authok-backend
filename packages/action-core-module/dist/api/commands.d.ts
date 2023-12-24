import { BaseCommand } from '../command';
export declare enum CommandTypes {
    SetMetadata = "SetMetadata",
    RedirectPrompt = "RedirectPrompt",
    RequireMultifactorAuth = "RequireMultifactorAuth",
    AccessDenied = "AccessDenied",
    SetCustomClaim = "SetCustomClaim"
}
export declare class SetMetadataCommand extends BaseCommand {
    constructor(target: string, key: string, value: string);
}
export declare class AccessDeniedCommand extends BaseCommand {
    constructor(reason: string);
}
export declare class SetCustomClaimCommand extends BaseCommand {
    constructor(target: string, name: string, value: string);
}
export declare class RedirectPromptCommand extends BaseCommand {
    constructor(url: string, resumeFn: string);
}
export declare class RequireMultifactorAuthCommand extends BaseCommand {
    constructor(provider: string, options?: any);
}
