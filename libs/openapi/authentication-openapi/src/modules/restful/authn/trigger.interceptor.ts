import {
  Inject,
  NestInterceptor,
  Logger,
  ExecutionContext,
  CallHandler,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { 
  IUserService,
  ITriggerService,
  TriggerContextBuilder,
} from 'libs/api/infra-api/src';
import { TriggerEvent, IWebRequest, IError } from '@authok/action-core-module';
import { nanoid } from 'nanoid';
import { of } from 'rxjs';
import { URL } from 'url';
import { RedisService } from '@authok/nestjs-redis';
import * as _ from 'lodash';
import * as ssHandler from '@authok/oidc-provider/lib/helpers/samesite_handler';
import { APIException } from 'libs/common/src/exception/api.exception';

@Injectable()
export class TriggerInterceptor implements NestInterceptor {
  constructor(
    @Inject('ITriggerService') private readonly triggerService: ITriggerService,
    @Inject('IUserService') private readonly userService: IUserService,
    private readonly redisService: RedisService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    Logger.log('trigger intercept');

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const provider = await req.customRequestContext.currentProvider();
    if (!provider) {
      throw new APIException('invalid_request', 'tenant not found');
    }

    try {
      const ctx = provider.app.createContext(req, res);
      ctx.oidc = new provider.OIDCContext(ctx); // 否则拿不到 cookie

      if (req.cookies.interaction) {
        Logger.debug(`cookie中存在 interaction: ${req.cookies.interaction}`);
      }

      const interaction = await provider.Interaction.find(
        ctx,
        req.params.uid || req.cookies.interaction,
      );
      if (!interaction) {
        Logger.warn(
          `interaction ${req.params.uid} 过期了, 那就删除cookie， 并执行正常流程`,
        );
        ssHandler.set(ctx.oidc.cookies, 'interaction', null, { path: '/' });

        return next.handle();
      }

      const { uid, prompt, params, result } = interaction;

      if (prompt.name !== 'login') {
        Logger.debug(`interaction: ${uid} 不是登录Prompt`);

        return next.handle();
      }

      if (!(interaction.result && interaction.result.login)) {
        Logger.debug(`interaction: ${uid} 登录没有通过`);

        return next.handle();
      }

      if (interaction.result.triggered) {
        Logger.debug(`interaction: ${uid} 已经完成了触发器`);
        return next.handle();
      }

      const request = {
        ip: req.ip,
        method: req.method, // 这里其实要拿到用户提交请求的 method, interaction中并没有传递，其实应该在 interaction中补充下
        // body:,
        query: { ...params, prompt: prompt.name },
        hostname: req.hostname,
        user_agent: req.headers['user-agent'],
        // headers: req.headers,
        // language: string;
        // geoip:
      } as IWebRequest;

      const user = await this.userService.retrieve(
        req.customRequestContext,
        result.login.accountId,
      );

      // 这里 user必须存在, 不存在再统一处理
      const event = {
        request,
        user: user,
      } as unknown as TriggerEvent;

      const response = await new Promise(async (resolver, reject) => {
        await this.triggerService.trigger(
          req.customRequestContext,
          new TriggerContextBuilder()
            .trigger('post-login')
            .event(event)
            .onErrors((errors: IError[]) => {
              const error = errors[0]; // 渐进式抛出异常
              reject(new BadRequestException(error.message));
            })
            .onCheckpoint(async (cmd, actionIndex: number) => {
              // 构造 state
              const state = nanoid(40);

              await this.redisService.getClient().set(
                `trigger:${state}`,
                JSON.stringify({
                  interaction: uid,
                  trigger: 'post-login',
                  index: actionIndex, // 下次执行后面的 binding
                  state,
                  event,
                  resumeFn: cmd.data.resumeFn,
                }),
                'EX',
                interaction.exp - Math.floor(Date.now() / 1000) - 1000,
              ); // 要在 interaction过期之前

              console.log('保存state并进行重定向: ', state);
              const url = new URL(cmd.data.url);
              url.searchParams.set('state', state);

              Logger.debug(`保存 interaction ${uid} 到 cookie, 用作 trigger`);
              ssHandler.set(ctx.oidc.cookies, 'interaction', uid, {
                maxAge: 200000,
                httpOnly: true,
                path: '/',
              });

              res.redirect(url.href);
              resolver(true);
            })
            .onFinish(() => resolver(null))
            .build(),
        );
      });

      if (response) {
        console.log('重定向走');
        return of(response);
      }

      // 成功过掉trigger，删除cookie, 这个interaction只是为了给 authorize端点读取
      Logger.debug(`删除cookie中的 interaction, 用作 trigger`);
      ssHandler.set(ctx.oidc.cookies, 'interaction', null, {
        path: '/',
      });
    } catch (e) {
      console.error('执行触发器出现错误, 当前忽略掉，直接进行后面的动作', e);
      throw e;
    }

    // this.triggerSerivce.trigger(ctx, 'post-login', req);
    // 这里执行登录后trigger
    // const this.triggerClient

    return next.handle();
  }
}
