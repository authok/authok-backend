import { Injectable, Inject, Logger } from '@nestjs/common';
import { IContext } from '@libs/nest-core';
import { ITriggerClient } from 'libs/support/trigger-client/src/interface';
import { TriggerResult } from '@authok/action-core-module';
import { 
  ITriggerService,
  TriggerModel,
  ITriggerRepository,
  ITriggerBindingRepository,
  TriggerContext,
  ActionContextBuilder,
  ActionContext,
} from 'libs/api/infra-api/src';
import { Page, PageQuery } from 'libs/common/src/pagination/pagination.model';

@Injectable()
export class TriggerService implements ITriggerService {
  constructor(
    @Inject('ITriggerRepository')
    private readonly triggerRepository: ITriggerRepository,
    @Inject('ITriggerBindingRepository')
    private readonly triggerBindingRepository: ITriggerBindingRepository,
    @Inject('ITriggerClient') private readonly triggerClient: ITriggerClient,
  ) {}

  async create(ctx: IContext, trigger: TriggerModel): Promise<TriggerModel> {
    return await this.triggerRepository.create(ctx, trigger);
  }

  async retrieve(ctx: IContext, id: string): Promise<TriggerModel | undefined> {
    return await this.triggerRepository.retrieve(ctx, id);
  }

  async update(
    ctx: IContext,
    trigger: Partial<TriggerModel>,
  ): Promise<TriggerModel> {
    return await this.triggerRepository.update(ctx, trigger);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    await this.triggerRepository.delete(ctx, id);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<TriggerModel>> {
    return await this.triggerRepository.paginate(ctx, query);
  }

  async trigger(ctx: IContext, triggerContext: TriggerContext): Promise<any> {
    const event = triggerContext.event;

    const trigger_id =
      triggerContext.trigger || triggerContext.checkpoint?.trigger;
    const bindingPage = await this.triggerBindingRepository.paginate(ctx, {
      trigger_id,
      page: 1,
      per_page: 100,
    });
    const bindings = bindingPage.items;

    for (let index = 0; index < bindings.length; ++index) {
      if (triggerContext.checkpoint) {
        if (index < triggerContext.checkpoint.index) continue;
      }

      const binding = bindings[index];
      Logger.log('准备执行 binding: ', binding.action.id);

      const secrets = {};
      if (binding.action.secrets) {
        for (const secret of binding.action.secrets) {
          secrets[secret.name] = secret.value;
        }
      }

      event.secrets = secrets;
      // 当前版本还没有实现 faas, 先用 single-server
      // if (process.env.ENV === 'DEV') {
      event.code = binding.action.code;
      // }

      const builder = new ActionContextBuilder()
        .trigger(trigger_id)
        .onCheckpoint(triggerContext.onCheckpoint)
        .event(event);

      if (triggerContext.commandListeners) {
        for (const type in triggerContext.commandListeners) {
          await builder.onCommand(type, triggerContext.commandListeners[type]);
        }
      }

      // 如果有 checkpoint, 对当前的 binding执行 continue
      if (
        triggerContext.checkpoint &&
        triggerContext.checkpoint.index === index
      ) {
        Logger.debug(
          `恢复上一次执行的 action, index: ${index}, resumeFn: ${triggerContext.checkpoint.resumeFn}`,
        );

        await this.runAction(
          builder.func(triggerContext.checkpoint.resumeFn).build(),
          index,
        );
        continue;
      }

      const needPause = await this.runAction(builder.build(), index);

      if (needPause) {
        // 构造 state
        return;
      }
    }

    await triggerContext.onFinish?.();
  }

  async runAction(
    actionContext: ActionContext,
    actionIndex: number,
  ): Promise<boolean> {
    const actionResult = await this.triggerClient.run<TriggerResult>(
      actionContext.trigger,
      actionContext.func,
      actionContext.event,
    );

    console.log('触发器运行结果: ', actionResult);

    if (actionResult.errors) {
      await actionContext.onErrors?.(actionResult.errors);
    }

    let needPause = false;

    let checkpointCmd;

    for (const command of actionResult.commands) {
      if (command.type === 'RedirectPrompt') {
        // 要重定向了, 记录 快照信息到 interactionSession
        needPause = true;
        checkpointCmd = command;
      } else {
        Logger.debug(
          `命令 ${command.type} 还没实现，应该用 命令模式进行设计, 这里只是快速原型`,
        );
      }

      const commandListener = actionContext.commandListeners[command.type];
      if (commandListener) {
        await commandListener(command);
      }
    }

    if (needPause) {
      await actionContext.onCheckpoint(checkpointCmd, actionIndex);
    }

    return needPause;
  }
}
