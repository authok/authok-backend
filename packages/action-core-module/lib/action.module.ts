import { Module, DynamicModule } from '@nestjs/common';
import { ActionService } from './service/action.service';
import { PostLoginActionRunner } from './runner/post-login.action.runner';
import * as path from 'path';
import { ScriptManager } from './script/script.manager';
import { PostRegisterActionRunner } from './runner/post-register.action.runner';
import { CredentailsExchangeActionRunner } from './runner/credentials-exchange.action.runner';

export interface ActionModuleOptions {
  scriptPath: string;
}

@Module({
  imports: [],
  providers: [
    ActionService,
    PostLoginActionRunner,
    PostRegisterActionRunner,
    CredentailsExchangeActionRunner,
    {
      provide: ScriptManager,
      useFactory: async () => {
        return new ScriptManager(path.join(process.cwd(), 'actions'));
      },
    },
    {
      provide: 'action_runners',
      useFactory: (
        postLogin: PostLoginActionRunner,
        postRegister: PostRegisterActionRunner,
        m2m: CredentailsExchangeActionRunner,
      ) => ({
        'post-login': postLogin,
        'post-register': postRegister,
        m2m,
      }),
      inject: [
        PostLoginActionRunner,
        PostRegisterActionRunner,
        CredentailsExchangeActionRunner,
      ],
    },
  ],
  exports: [ActionService, ScriptManager],
})
export class ActionModule {
  static register(options: ActionModuleOptions): DynamicModule {
    return {
      module: ActionModule,
      imports: [],
      providers: [
        ActionService,
        PostLoginActionRunner,
        PostRegisterActionRunner,
        CredentailsExchangeActionRunner,
        {
          provide: ScriptManager,
          useFactory: async () => {
            return new ScriptManager(
              options.scriptPath || path.join(process.cwd(), 'actions'),
            );
          },
        },
        {
          provide: 'action_runners',
          useFactory: (
            postLogin: PostLoginActionRunner,
            postRegister: PostRegisterActionRunner,
            m2m: CredentailsExchangeActionRunner,
          ) => ({
            'post-login': postLogin,
            'post-register': postRegister,
            m2m,
          }),
          inject: [
            PostLoginActionRunner,
            PostRegisterActionRunner,
            CredentailsExchangeActionRunner,
          ],
        },
      ],
      exports: [ActionService, ScriptManager],
    };
  }
}
