import { BaseCommand } from '../command';

export enum CommandTypes {
  SetMetadata = 'SetMetadata',
  RedirectPrompt = 'RedirectPrompt',
  RequireMultifactorAuth = 'RequireMultifactorAuth',
  AccessDenied = 'AccessDenied',
  SetCustomClaim = 'SetCustomClaim',
}

export class SetMetadataCommand extends BaseCommand {
  constructor(target: string, key: string, value: string) {
    super(CommandTypes.SetMetadata, {
      target,
      key,
      value,
    });
  }
}

export class AccessDeniedCommand extends BaseCommand {
  constructor(reason: string) {
    super(CommandTypes.AccessDenied, reason);
  }
}

export class SetCustomClaimCommand extends BaseCommand {
  constructor(target: string, name: string, value: string) {
    super(CommandTypes.SetCustomClaim, {
      target,
      name,
      value,
    });
  }
}

export class RedirectPromptCommand extends BaseCommand {
  constructor(url: string, resumeFn: string) {
    super(CommandTypes.RedirectPrompt, {
      url,
      resumeFn,
    });
  }
}

export class RequireMultifactorAuthCommand extends BaseCommand {
  constructor(provider: string, options?: any) {
    super(CommandTypes.RequireMultifactorAuth, {
      provider,
      options,
    });
  }
}
