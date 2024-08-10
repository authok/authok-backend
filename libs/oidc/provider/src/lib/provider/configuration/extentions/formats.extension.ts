import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IConfiguration } from '../configuration.builder';
import { IExtension } from '../../extention';
import { IContext } from '@libs/nest-core';
import { 
  ITriggerService,
  IClientService,
  TriggerContextBuilder,
} from 'libs/api/infra-api/src';
import {
  TriggerEvent,
  IWebRequest,
  IError,
  ICommand,
} from '@authok/action-core-module';
import { SetCustomClaimCommand } from 'packages/action-core-module/dist/api/commands';

@Injectable()
export class FormatsExtension implements IExtension<IConfiguration> {
  constructor(
    @Inject('ITriggerService') private readonly triggerService: ITriggerService,
    @Inject('IClientService') private readonly clientService: IClientService,
  ) {}

  /**
   * TODO 还要处理 access deny 拒绝颁发令牌
   * @param ctx
   * @param token
   * @param jwt
   */
  private async triggerCredentialsExchange(ctx, token, jwt) {
    const req = ctx.req;

    const request = {
      ip: req.ip,
      method: req.method, // 这里其实要拿到用户提交请求的 method, interaction中并没有传递，其实应该在 interaction中补充下
      // body:,
      query: req.query,
      hostname: req.hostname,
      user_agent: req.headers['user-agent'],
      // headers: req.headers,
      // language: string;
      // geoip:
    } as IWebRequest;

    // 需要拿到 client_metadata
    const client = ctx.oidc.client;

    // 这里 user必须存在, 不存在再统一处理
    const event = {
      accessToken: {
        scope: (ctx.oidc.params.scope ?? '').split(' '),
        customClaims: jwt.payload,
      },
      resource_server: {
        identifier: ctx.oidc.params.audience,
      },
      client: {
        client_id: client.client_id,
        name: client.name,
        metadata: client.client_metadata,
      },
      request,
    } as unknown as TriggerEvent;

    // TODO
    // 应该改成  const result = await trigger(req, TriggerParams);
    // 然后直接轮询处理 result
    await this.triggerService.trigger(
      req.customRequestContext,
      new TriggerContextBuilder()
        .trigger('m2m')
        .event(event)
        .onCommand('SetCustomClaim', (command: ICommand): Promise<void> => {
          const c = command as SetCustomClaimCommand;
          const { name, value } = c.data;
          jwt.payload[name] = value;

          console.log(
            '处理命令 SetCustomClaim: ',
            command,
            'jwt.payload: ',
            jwt.payload,
          );

          return;
        })
        .onErrors((errors: IError[]) => {
          console.error(errors);
          const error = errors[0]; // 渐进式抛出异常
          throw new BadRequestException(error.message);
        })
        .onFinish(() => {
          console.log('credentials exchange 触发器完成');
        })
        .build(),
    );
  }

  extend(ctx: IContext, configuration: IConfiguration) {
    const jwt = async (ctx, token, jwt) => {
      // TODO 获取登录时的 org_id
      // jwt.header = { foo: 'bar' };
      // 要获取到当前的 org_id, user 还是 code 中;
      const session = await ctx.oidc.provider.Session.findByUid(
        ctx,
        token.sessionUid,
      );
      // 前面 check已经验证了 organization 合法
      if (session) {
        const org_id = session.authorizationFor(
          ctx.oidc.client.clientId,
        ).org_id;
        if (org_id) {
          console.log(
            '会话中有 org_id ',
            org_id,
            ctx.req.path,
            ctx.oidc.params,
          );

          jwt.payload.org_id = org_id;
        } else {
          console.warn('会话中没有 org_id');
        }
      } else {
        if (ctx.oidc.params.grant_type === 'client_credentials') {
          await this.triggerCredentialsExchange(ctx, token, jwt);
        }

        console.warn(
          '没有session, 应该是 credentials client, grant_type',
          ctx.oidc.params.grant_type,
        );
      }
    };
    configuration.set('formats.customizers.jwt', jwt);

    const paseto = (ctx, token, structuredToken) => {
      console.log('paseto: ', structuredToken);
    };
    configuration.set('formats.customizers.paseto', paseto);
  }
}
