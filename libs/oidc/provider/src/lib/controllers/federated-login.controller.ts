import {
  Controller,
  Get,
  Req,
  Res,
  HttpStatus,
  Inject,
  NotFoundException,
  ForbiddenException,
  Query,
  Logger,
  Param,
  BadRequestException,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { 
  IUserService,
  IConnectionService,
  IIdentityService,
  IClientService,
  UserEvents,
} from 'libs/api/infra-api/src';
import { 
  UserDto, 
  UpdateUserDto,
  IdentityDto,
} from 'libs/dto/src';
import { IAuthorizationManager } from 'libs/api/authorization-api/src/authorization.manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { APIException } from 'libs/common/src/exception/api.exception';
import { isSocialStrategy } from 'libs/core/authorization-core/src/utils/utils';
import { OAuth2IdentityProvider } from 'libs/core/authorization-core/src/idp/oauth2.identity.provider';
import { nanoid } from 'nanoid';
import * as sessionHandler from '@authok/oidc-provider/lib/shared/session';
import * as instance from '@authok/oidc-provider/lib/helpers/weak_cache';
import * as ssHandler from '@authok/oidc-provider/lib/helpers/samesite_handler';
import * as url from 'url';

@Controller()
export class FederatedLoginController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IAuthorizationManager')
    private readonly authorizationManager: IAuthorizationManager,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IClientService')
    private readonly clientService: IClientService,
    @Inject('IIdentityService')
    private readonly identityService: IIdentityService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private validateUser(user: UserDto) {
    if (user.blocked) {
      throw new ForbiddenException('account blocked');
    }
  }

  @Get(['login/callback/:connection/:client_id'])
  async idpInitialCallbackGet(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
    @Param('connection') connectionName: string,
    @Param('client_id') client_id: string,
  ) {
    Logger.debug(`IDP initial callback: ${req.url}`);

    if (!code)
      throw new APIException(
        'invalid request',
        'identity provider unexpected error message',
        HttpStatus.BAD_REQUEST,
      );

    const provider = await ctx.currentProvider();

    const connection = await this.connectionService.findByName(
      ctx,
      connectionName,
    );

    if (!connection) {
      throw new APIException(
        'invalid request',
        'connection not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    ctx.connection = connection;

    // 如果获取租户的默认 client, 但是此client未必对connection开启
    if (!client_id) {
      throw new APIException(
        'invalid request',
        'not enable client for connection',
        HttpStatus.BAD_REQUEST,
      );
    }

    const client = await this.clientService.retrieve(ctx, client_id);
    if (!client) {
      throw new APIException(
        'invalid request',
        `client not found, client_id: ${client_id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 目前这里只处理了 oauth2 / oidc 类型的回调

    const idp = this.authorizationManager.get(
      connection.strategy,
    ) as OAuth2IdentityProvider;
    if (!idp) {
      throw new NotFoundException(`idp: ${connection.strategy} not found`);
    }

    const accessTokenResult = await idp.exchange(ctx, code);

    console.log('accessTokenResult: ', accessTokenResult);

    const profile_data = await idp.fetchUserInfo(
      ctx,
      accessTokenResult.access_token,
    );

    console.log('profile: ', profile_data);

    const now = new Date();

    const identity = {
      user_id: profile_data.user_id,
      access_token: accessTokenResult.access_token,
      expires_in: accessTokenResult.expires_in,
      refresh_token: accessTokenResult.refresh_token,
      provider: connection.strategy,
      is_social: isSocialStrategy(connection.strategy),
      profile_data,
      connection: connection.name,
    } as IdentityDto;

    // 合并 identity 到本地, 方便日后 userinfo 查询

    /*
    let federatedUser = await this.userService.findByConnection(
      ctx,
      connection.name,
      identity.user_id,
    );
    */
    let federatedUser = await this.userService.findByIdentityProvider(
      ctx,
      connection.strategy, // TODO 要根据 connection.provider 来查找，比如 wechat 是一个 provider，但是 wechat 有很多 strategy
      identity.user_id,
    );

    // 创建新用户
    if (!federatedUser) {
      Logger.debug(
        `没有找到 联合登录账户,  connection: ${connection.name}, user_id: ${identity.user_id}, nickname: ${identity.profile_data.nickname}`,
      );

      // 创建新user
      federatedUser = await this.userService.create(ctx, {
        user_id: identity.provider + '|' + identity.user_id,
        name: identity.profile_data.name,
        connection: identity.connection,
        // username: identity.profile_data.username,
        nickname: identity.profile_data.nickname,
        picture: identity.profile_data.picture,
        signup_ip: req.ip,
        last_ip: req.ip,
        signup_at: new Date(),
        last_login: now,
        identities: [identity],
      });
    } else {
      // 把 identity 合并到主 user
      this.validateUser(federatedUser as unknown as UserDto);

      Logger.debug(
        `找到 联合登录账户,  connection: ${connection.name}, user_id: ${identity.user_id}, nickname: ${identity.profile_data.nickname}`,
      );

      const targetIdentity = federatedUser.identities.find(
        (it) =>
          identity.user_id == it.user_id &&
          identity.connection == it.connection,
      );

      if (targetIdentity) {
        await this.identityService.update(ctx, targetIdentity.id, {
          is_social: identity.is_social,
          access_token: identity.access_token,
          expires_in: identity.expires_in,
          refresh_token: identity.refresh_token,
          last_login: now,
          profile_data: identity.profile_data,
        });

        Logger.log(
          `更新 身份源对应的 identity, connection: ${connection.name}, identity id: ${targetIdentity.id}`,
        );
      } else {
        // 新建身份源对应的 identity
        const newIdentity = await this.userService.addFederatedIdentity(
          ctx,
          federatedUser.user_id,
          {
            ...identity,
            last_login: now,
          },
        );

        Logger.log(
          `新建 身份源对应的 identity, connection: ${connection.name}, identity id: ${newIdentity.user_id}`,
        );
      }

      if (connection.options.set_user_root_attributes) {
        Logger.log(
          `更新 主档案, connection: ${connection.name}, user_id: ${federatedUser.user_id}`,
        );

        await this.userService.update(ctx, federatedUser.user_id, {
          // username: profile_data.username,
          nickname: profile_data.nickname,
          gender: profile_data.gender,
          picture: profile_data.picture,
          last_login: now,
          last_ip: req.ip,
        } as Partial<UpdateUserDto>);
      } else {
        Logger.log(
          `不更新主档案 identity, strategy: ${connection.strategy}, user_id: ${federatedUser.user_id}`,
        );
      }
    }

    const _ctx = provider.app.createContext(req, res);
    _ctx.oidc = new provider.OIDCContext(_ctx);

    const uid = nanoid();
    const returnTo = _ctx.oidc.urlFor('resume', {
      uid,
    });

    const params = {
      scope: 'openid profile email',
      client_id,
      prompt: 'login',
      connection: connectionName,
      redirect_uri: client.redirect_uris[0],
      response_type: 'code',
      response_mode: 'query',
    };
    console.log('idp login callback oidc params: ', params);

    const { policy, url: interactionUrl } =
      instance(provider).configuration('interactions');

    await sessionHandler(_ctx, async () => {
      const grant = new provider.Grant({
        accountId: federatedUser.user_id,
        clientId: client_id,
      });
      grant.addOIDCScope(params.scope);

      await grant.save(_ctx);
      _ctx.oidc.session.grantIdFor(client_id, grant.jti);

      const result = {
        login: {
          accountId: federatedUser.user_id,
          loginTs: Math.floor(now.getTime() / 1000),
        },
      };

      const interactionSession = new provider.Interaction(uid, {
        returnTo,
        prompt: {
          name: 'login',
        },
        accountId: federatedUser.user_id,
        params,
        // trusted: oidc.trusted,
        session: _ctx.oidc.session,
        grant: grant,
        result,
      });

      const cookieOptions = instance(provider).configuration('cookies.short');
      let ttl = instance(provider).configuration('ttl.Interaction');
      if (typeof ttl === 'function') {
        ttl = ttl(ctx, interactionSession);
      }

      await interactionSession.save(_ctx, ttl);

      const destination = await interactionUrl(ctx, interactionSession);

      ssHandler.set(
        _ctx.oidc.cookies,
        provider.cookieName('interaction'),
        uid,
        {
          path: url.parse(destination).pathname,
          ...cookieOptions,
          maxAge: ttl * 1000,
        },
      );

      ssHandler.set(_ctx.oidc.cookies, provider.cookieName('resume'), uid, {
        ...cookieOptions,
        path: url.parse(returnTo).pathname,
        domain: undefined,
        httpOnly: true,
        maxAge: ttl * 1000,
      });

      this.eventEmitter.emit(UserEvents.Logined, {
        ip: req.ip,
        hostname: req.hostname,
        user_agent: req.headers['user-agent'],
        client_id: params.client_id,
        connection: connection.name,
        scope: params.scope,
        tenant: federatedUser.tenant,
        user_id: federatedUser.user_id,
        user_name:
          federatedUser.name ||
          federatedUser.username ||
          federatedUser.nickname,
      });

      Logger.log(`before redirect to returnTo: ${returnTo}`);

      // _ctx.status = 303;
      // _ctx.redirect(returnTo);
    });
    res.redirect(returnTo);
  }

  @Get(['login/callback', 'login/callback/federated', 'login/federated'])
  async callbackGet(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    Logger.debug(`联合登录回调: ${req.url}`);
    console.log('login headers: ', req.headers, ctx.tenant);
    // 打个补丁
    // https://fuwu.jinritemai.com/
    // https://fxg.jinritemai.com/
    if (
      ctx.tenant === 'org_5MpprRSVPhC3M75GPENKi0nb' &&
      req.headers.referer.indexOf('jinritemai') !== -1 &&
      (!state || state === '') // 没有 state 代表是 idp 发起的回调
    ) {
      Logger.log('特殊处理 zall 抖店, 因为其抖店开放平台回调地址没有具体设置');

      const client_id = 'cbV4wesSiRu766WrYDkKcs73XktRYdCU';
      const connection = 'doudian';

      await this.idpInitialCallbackGet(
        ctx,
        req,
        res,
        code,
        connection,
        client_id,
      );
      /*
      const url = new URL(
        `https://${req.hostname}/login/callback/doudian?code=${code}`,
      );
      const forwardRequest = https.request(
        url,
        {
          method: 'GET',
          headers: req.headers,
        },
        async (forwardResponse) => {
          console.log(`Got response from ${url}`, forwardResponse.headers);
          res.writeHead(forwardResponse.statusCode!, forwardResponse.headers);
          forwardResponse.pipe(res);
        },
      );
      req.pipe(forwardRequest);
      */
      return;
    }

    const provider = await ctx.currentProvider();
    if (!provider) {
      throw new NotFoundException('provider not found');
    }

    const details = await provider.interactionDetails(req, res);
    if (!details) {
      throw new APIException('invalid request', '请求已过期');
    }

    const { params } = details;
    console.log('xxdetails: ', details);

    const connection = await this.connectionService.findByName(
      ctx,
      params.connection,
    );

    if (!connection) {
      throw new APIException(
        'invalid request',
        'connection not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    ctx.connection = connection;

    const _state = (req as any).session[`${connection.name}.state`];

    if (!_state) {
      throw new APIException(
        'invalid request',
        'identity provider missing state message',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!code)
      throw new APIException(
        'invalid request',
        'identity provider unexpected error message',
        HttpStatus.BAD_REQUEST,
      );

    if (state !== _state) {
      Logger.error(`state not match. income: ${state}, previous: ${_state}`);
      throw new APIException('invalid request', 'state not matched');
    }

    // 目前这里只处理了 oauth2 / oidc 类型的回调

    const idp = this.authorizationManager.get(
      connection.strategy,
    ) as OAuth2IdentityProvider;
    if (!idp) {
      throw new NotFoundException(`idp: ${connection.strategy} not found`);
    }

    const accessTokenResult = await idp.exchange(ctx, code);

    console.log('accessTokenResult: ', accessTokenResult);

    const profile_data = await idp.fetchUserInfo(
      ctx,
      accessTokenResult.access_token,
    );

    console.log('profile: ', profile_data);

    const now = new Date();

    const identity = {
      user_id: profile_data.user_id,
      access_token: accessTokenResult.access_token,
      expires_in: accessTokenResult.expires_in,
      refresh_token: accessTokenResult.refresh_token,
      provider: connection.strategy,
      is_social: isSocialStrategy(connection.strategy),
      profile_data,
      connection: connection.name,
    } as IdentityDto;

    // 合并 identity 到本地, 方便日后 userinfo 查询

    /*
    let federatedUser = await this.userService.findByConnection(
      ctx,
      connection.name,
      identity.user_id,
    );
    */
    let federatedUser = await this.userService.findByIdentityProvider(
      ctx,
      connection.strategy, // TODO 要根据 connection.provider 来查找，比如 wechat 是一个 provider，但是 wechat 有很多 strategy
      identity.user_id,
    );

    // 创建新用户
    if (!federatedUser) {
      Logger.debug(
        `没有找到 联合登录账户,  connection: ${connection.name}, user_id: ${identity.user_id}, nickname: ${identity.profile_data.nickname}`,
      );

      // 创建新user
      federatedUser = await this.userService.create(ctx, {
        user_id: identity.provider + '|' + identity.user_id,
        name: identity.profile_data.name,
        connection: identity.connection,
        // username: identity.profile_data.username,
        nickname: identity.profile_data.nickname,
        picture: identity.profile_data.picture,
        signup_ip: req.ip,
        last_ip: req.ip,
        signup_at: new Date(),
        last_login: now,
        identities: [identity],
      });
    } else {
      // 把 identity 合并到主 user
      this.validateUser(federatedUser as unknown as UserDto);

      Logger.debug(
        `找到 联合登录账户,  connection: ${connection.name}, user_id: ${identity.user_id}, nickname: ${identity.profile_data.nickname}`,
      );

      const targetIdentity = federatedUser.identities.find(
        (it) =>
          identity.user_id == it.user_id &&
          identity.connection == it.connection,
      );

      if (targetIdentity) {
        await this.identityService.update(ctx, targetIdentity.id, {
          is_social: identity.is_social,
          access_token: identity.access_token,
          expires_in: identity.expires_in,
          refresh_token: identity.refresh_token,
          last_login: now,
          profile_data: identity.profile_data,
        });

        Logger.log(
          `更新 身份源对应的 identity, connection: ${connection.name}, identity id: ${targetIdentity.id}`,
        );
      } else {
        // 新建身份源对应的 identity
        const newIdentity = await this.userService.addFederatedIdentity(
          ctx,
          federatedUser.user_id,
          {
            ...identity,
            last_login: now,
          },
        );

        Logger.log(
          `新建 身份源对应的 identity, connection: ${connection.name}, identity id: ${newIdentity.user_id}`,
        );
      }

      if (connection.options.set_user_root_attributes) {
        Logger.log(
          `更新 主档案, connection: ${connection.name}, user_id: ${federatedUser.user_id}`,
        );

        await this.userService.update(ctx, federatedUser.user_id, {
          // username: profile_data.username,
          nickname: profile_data.nickname,
          gender: profile_data.gender,
          picture: profile_data.picture,
          last_login: now,
          last_ip: req.ip,
        } as Partial<UpdateUserDto>);
      } else {
        Logger.log(
          `不更新主档案 identity, strategy: ${connection.strategy}, user_id: ${federatedUser.user_id}`,
        );
      }
    }

    this.eventEmitter.emit(UserEvents.Logined, {
      ip: req.ip,
      hostname: req.hostname,
      user_agent: req.headers['user-agent'],
      client_id: params.client_id,
      audience: params.audience,
      connection: connection.name,
      scope: params.scope,
      tenant: federatedUser.tenant,
      user_id: federatedUser.user_id,
      user_name:
        federatedUser.name || federatedUser.username || federatedUser.nickname,
    });

    // 要逐步替代成 session 保存
    delete (req as any).session[`${ctx.connection.name}.state`];
    delete (req as any).session[`${ctx.connection.name}.nonce`];

    const result = {
      login: {
        accountId: federatedUser.user_id,
        loginTs: Math.floor(now.getTime() / 1000),
      },
    };

    return provider.interactionFinished(req, res, result, {
      mergeWithLastSubmission: false,
    });
  }
}
