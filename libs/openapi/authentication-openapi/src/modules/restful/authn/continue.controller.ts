import {
  Controller,
  Query,
  Get,
  NotFoundException,
  BadRequestException,
  Res,
  Inject,
  Logger,
  Req,
  Post,
} from '@nestjs/common';
import { RedisService } from '@authok/nestjs-redis';
import { ReqCtx, IRequestContext } from '@libs/nest-core';
import { Response, Request } from 'express';
import { 
  ITriggerService,
  TriggerContextBuilder,
} from 'libs/api/infra-api/src';
import { IWebRequest, IError } from '@authok/action-core-module';
import { nanoid } from 'nanoid';
import * as _ from 'lodash';

// action 恢复
@Controller()
export class ContinueController {
  constructor(
    private readonly redisService: RedisService,
    @Inject('ITriggerService') private readonly triggerService: ITriggerService,
  ) {}

  @Post('continue')
  async continue(
    @ReqCtx() ctx: IRequestContext,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // TODO provider的获取要做一个装饰器 @OidcProvider，并且把非空判断给做了
    const provider = await ctx.currentProvider();
    if (!provider) {
      throw new NotFoundException('provider not found');
    }

    Logger.log(`找到state: ${state}`);

    const checkpointData = await this.redisService
      .getClient()
      .get(`trigger:${state}`);
    if (!checkpointData) {
      throw new NotFoundException('认证事务已过期');
    }
    const checkpoint = JSON.parse(checkpointData);

    const _ctx = provider.app.createContext(req, res);
    const interaction = await provider.Interaction.find(
      _ctx,
      checkpoint.interaction,
    );
    if (!interaction) {
      console.error('会话已超时，还玩个屁啊', checkpoint.interaction);
      throw new BadRequestException('认证会话已超时');
    }

    const request = {
      ip: req.ip,
      method: req.method, // 这里其实要拿到用户提交请求的 method, interaction中并没有传递，其实应该在 interaction中补充下
      body: req.body,
      query: req.query,
      hostname: req.hostname,
      user_agent: req.headers['user-agent'],
      // headers: req.headers,
      // language: string;
      // geoip:
    } as IWebRequest;

    const event = checkpoint.event;
    event.request = request;

    await this.triggerService.trigger(
      ctx,
      new TriggerContextBuilder()
        .checkpoint(checkpoint)
        .event(event)
        .trigger(checkpoint.trigger)
        .onErrors((errors: IError[]) => {
          console.error(errors);
          throw new BadRequestException('出现错误');
        })
        .onCheckpoint(async (cmd, index: number) => {
          try {
            const { url, resumeFn } = cmd.data;
            const state = nanoid(40);

            checkpoint.resumeFn = resumeFn;
            checkpoint.index = index; // 下次从当前开始
            checkpoint.state = state;

            await this.redisService
              .getClient()
              .set(
                `trigger:${state}`,
                JSON.stringify(checkpoint),
                'EX',
                interaction.exp - Math.floor(Date.now() / 1000) - 1000,
              ); // 要在 interaction过期之前

            const redirectUrl = new URL(url);
            redirectUrl.searchParams.set('state', state);

            Logger.debug(
              `保存state: ${state}, 进行重定向到URL: ${redirectUrl.href}'`,
            );

            res.redirect(redirectUrl.href);
          } catch (e) {}
        })
        .onFinish(() => {
          // 标记已经完成了触发器
          interaction.result.triggered = true;
          interaction.save(_ctx, Math.floor(Date.now() / 1000));

          res.redirect('/authorize/' + checkpoint.interaction);
        })
        .build(),
    );
  }
}
