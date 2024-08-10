import {
  Body,
  Controller,
  Get,
  Param,
  Req,
  Res,
  Post,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Logger,
} from '@nestjs/common';

import * as assert from 'assert';
import * as urljoin from 'url-join';
import { InvalidRequest } from '@authok/oidc-provider/lib/helpers/errors';
import { TokenSet } from 'openid-client';

import { Request, Response } from 'express';
import { InteractionResults } from '@authok/oidc-provider';
import { SessionNotFound } from '@authok/oidc-provider/lib/helpers/errors';

import { urlHas, urlFragment, TwoFactorAuthUtils } from 'libs/oidc/common/src';
import { IRequestContext, ReqCtx } from '@libs/nest-core';
import { 
  IUserService,
  IConnectionService,
  IClientService,
  ITenantService,
  UserEvents,
  IOrganizationMemberService,
  IIdentityService,
  IInvitationService,
} from 'libs/api/infra-api/src';
import { 
  UserDto, 
  UpdateUserDto,
  IdentityDto,
} from 'libs/dto/src';
import { IAuthenticationManager } from 'libs/api/authentication-api/src';
import { PasswordCredentials } from 'libs/core/authentication-core/src/credentials';
import { IAuthorizationManager } from 'libs/api/authorization-api/src/authorization.manager';
import { ITicket, ITicketRegistry } from 'libs/api/ticket-api/src';
import { WrongUsernameOrPasswordError } from 'libs/common/src/exception/exceptions';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { APIException } from 'libs/common/src/exception/api.exception';

@Controller()
export class InteractionController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IIdentityService')
    private readonly identityService: IIdentityService,
    @Inject('IAuthenticationManager')
    private readonly authenticationManager: IAuthenticationManager,
    @Inject('IAuthorizationManager')
    private readonly authorizationManager: IAuthorizationManager,
    @Inject('IConnectionService')
    private readonly connectionService: IConnectionService,
    @Inject('IClientService')
    private readonly clientService: IClientService,
    @Inject('ITicketRegistry') private readonly ticketRegistry: ITicketRegistry,
    private readonly eventEmitter: EventEmitter2,
    @Inject('ITenantService') private readonly tenantService: ITenantService,

    @Inject('IInvitationService')
    private readonly invitationService: IInvitationService,
    @Inject('IOrganizationMemberService')
    private readonly organizationMemberService: IOrganizationMemberService,
  ) {}

  @Get('login')
  public async interactionGet(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const provider = await ctx.currentProvider();
    if (!provider) {
      throw new NotFoundException('provider not found');
    }

    try {
      const details = await provider.interactionDetails(req, res);
      const { uid, prompt, params, session } = details;

      const client = await this.clientService.retrieve(ctx, params.client_id);
      if (!client) {
        throw new NotFoundException('client not found');
      }

      // 默认语言，可在前端选择语言
      const language = 'zh';

      const name = prompt.name;
      console.log('prompt: ', prompt, params);
      switch (name) {
        case 'login': {
          const login_ticket = params.login_ticket;
          if (login_ticket) {
            // 判断 ticket 是否已登录成功
            console.log('通过 login_ticket 登录: ', params, prompt);

            const ticket: ITicket = await this.ticketRegistry.get(
              'login',
              login_ticket,
            );

            if (!ticket) {
              throw new HttpException(
                'ticket not found',
                HttpStatus.BAD_REQUEST,
              );
            }

            if (ticket.isExpired()) {
              const result = {
                error: 'access_denied',
                error_description: 'ticket expired',
              };
              await provider.interactionFinished(req, res, result, {
                mergeWithLastSubmission: false,
              });
              return;
            }

            ticket.markTicketExpired();

            Logger.debug(
              `找到 ticket并标记过期, 对应 user_id: ${ticket.payload}`,
            );

            // 未过期，正常流程
            await this.ticketRegistry.delete('login', ticket.id);

            const user = await this.userService.retrieve(ctx, ticket.payload);
            if (!user) {
              const result = {
                error: 'access_denied',
                error_description: '未找到用户',
              };
              await provider.interactionFinished(req, res, result, {
                mergeWithLastSubmission: false,
              });
              return;
            }

            // 二要素
            if (user.enabled2fa) {
              const locals = {
                title: '登录',
                details: details,
                email: user.email,
                username: user.username,
                user_id: user.user_id,
                error: false,
              };

              return res.render('2fa-auth', locals, (err, html) => {
                if (err) throw new HttpException(err, HttpStatus.BAD_REQUEST);

                res.render('_layout-simple', {
                  ...locals,
                  body: html,
                });
              });
            }

            const now = new Date();
            await this.userService.update(ctx, user.user_id, {
              last_login: now,
              last_ip: req.ip,
            });

            this.eventEmitter.emit(UserEvents.Logined, {
              hostname: req.hostname,
              user_id: user.user_id,
              user_name:
                user.name ||
                user.username ||
                user.email ||
                user.phone_number ||
                user.nickname,
              user_agent: req.headers['user-agent'],
              ip: req.ip,
              client_id: params.client_id,
              audience: params.audience,
              connection: params.connection || params.realm, // TODO 这里的 realm 是兼容 auth0的sdk, 后面要全部规范化为 connection
              scope: params.scope,
              tenant: ctx.tenant,
            });

            // 正常登录流程
            const result: InteractionResults = {
              select_account: {},
              login: {
                accountId: user.user_id,
                acr: 'urn:mace:incommon:iap:bronze',
                amr: ['pwd'],
                remember: true,
                ts: Math.floor(Date.now() / 1000),
              },
              // consent was given by the user to the client for this session
              /*
              consent: {
                rejectedScopes: ['profile'], // array of strings, scope names the end-user has not granted
                rejectedClaims: [], // array of strings, claim names the end-user has not granted
              },
              */
              meta: {},
            };

            console.log('provider.interactionFinished');

            await provider.interactionFinished(req, res, result, {
              mergeWithLastSubmission: false,
            });
            return;
          }

          // 否则弹出登录页面

          console.log('/login 1. 即将登录: 登录参数: ', prompt, params);
          // TODO 从 租户品牌化 branding 获取
          const title = '登录';

          // 判断是否第三方登录
          const connectionName =
            (params.connection as string) || (params.realm as string);
          if (connectionName) {
            Logger.debug(`/login 2. 即将通过身份源 ${connectionName} 进行授权`);
            const connection = await this.connectionService.findByName(
              ctx,
              connectionName,
            );

            if (!connection) {
              throw new NotFoundException(
                `Connection: ${connectionName} not found`,
              );
            }

            ctx.connection = connection;

            if (connection.strategy !== 'authok') {
              await this.authorizationManager.authorize(
                connection.strategy,
                ctx,
                req,
                res,
              );
              return;
            }
          }

          const baseUrl = urljoin('https://', req.hostname);

          const { state, protocol, ...restParams } = params;
          const authParams = {
            ...restParams,
            domain: req.hostname,
            dict: language,
            extraParams: {
              protocol,
              state,
            },
            internalOptions: {
              ...restParams,
              protocol,
              state,
            },
          };

          const locals = {
            title,
            tenant: ctx.tenant,
            issuer: provider.issuer,
            // language,
            // params,
            authParams,
            baseUrl,
            details: prompt.details,
            error: false,
            interaction: true,
            devMode: urlHas(req.path, 'dev', true),
          };

          return res.render('login/login', locals);
        }
        case 'consent': {
          return res.render('login/consent', {
            client,
            uid,
            details: prompt.details,
            params,
            title: '授权',
            session: session ? console.log(session) : undefined,
          });
        }
        case 'invitation': {
          console.log('收到邀请xxx');
          const invitation = await this.invitationService.findByTicket(
            ctx,
            prompt.details.invitation,
          );

          const locals = {
            uid,
            tenant: ctx.tenant,
            params,
            invitation,
            details: prompt.details,
          };

          return res.render('login/invitation', locals);
        }
        default: {
          throw new HttpException(
            'Unknown prompt type',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } catch (err) {
      console.error('eee: ', err);
      if (err instanceof SessionNotFound) {
        const tenant = await this.tenantService.retrieve({}, ctx.tenant);
        if (tenant && tenant.default_redirection_uri) {
          // 把用户重定向到 client.initial_login
          Logger.log('把用户重定向到 client.initial_login');

          res.redirect(tenant.default_redirection_uri);
          return;
        } else {
          Logger.warn('租户没有设置默认登录页');
        }
      }

      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  public async interactionLoginPost(
    @ReqCtx() ctx: IRequestContext,
    @Body() body,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // TODO 通过 oidcService 把对应的 provider 找出来
    const provider = await ctx.currentProvider();

    const details = await provider.interactionDetails(req, res);
    const { prompt, params } = details;

    try {
      // TODO 要校验 body
      const { connection, username, password } = body;
      console.log('xxxbody: ', body);
      console.log('xxxparams: ', params);

      const credentials: PasswordCredentials = {
        credential_type: 'http://authok.io/oauth/grant-type/password-realm',
        client_id: params.client_id,
        connection,
        username,
        password,
      };
      const principal = await this.authenticationManager.authenticate(
        ctx,
        credentials,
      );

      if (!principal) {
        throw new WrongUsernameOrPasswordError('用户名 / 密码 错误');
      }

      const user = principal as UserDto;

      // 二要素
      if (user.enabled2fa) {
        const locals = {
          title: '登录',
          details: details,
          email: user.email,
          username: user.username,
          user_id: user.user_id,
          error: false,
        };

        return res.render('2fa-auth', locals, (err, html) => {
          if (err) throw new HttpException(err, HttpStatus.BAD_REQUEST);

          res.render('_layout-simple', {
            ...locals,
            body: html,
          });
        });
      }

      const now = new Date();
      await this.userService.update(ctx, user.user_id, {
        last_login: now,
        last_ip: req.ip,
      });

      this.eventEmitter.emit(UserEvents.Logined, {
        hostname: req.hostname,
        user_id: user.user_id,
        user_name:
          user.name ||
          user.username ||
          user.email ||
          user.phone_number ||
          user.nickname,
        user_agent: req.headers['user-agent'],
        ip: req.ip,
        client_id: params.client_id,
        audience: params.audience,
        connection: params.connection,
        scope: params.scope,
        tenant: ctx.tenant,
      });

      console.log('provider.interactionFinished');
      // 正常登录流程
      const result: InteractionResults = {
        select_account: {},
        login: {
          accountId: user.user_id,
          acr: 'urn:mace:incommon:iap:bronze',
          amr: ['pwd'],
          remember: true,
          ts: Math.floor(Date.now() / 1000),
        },
        // consent was given by the user to the client for this session
        /*
        consent: {
          rejectedScopes: ['profile'], // array of strings, scope names the end-user has not granted
          rejectedClaims: [], // array of strings, claim names the end-user has not granted
        },
        */
        meta: {},
      };
      await provider.interactionFinished(req, res, result, {
        mergeWithLastSubmission: false,
      });
    } catch (err) {
      console.log('err', err);

      const authParams = {
        ...params,
        domain: req.hostname,
      };

      const locals = {
        // params,
        authParams,
        details: prompt.details,
        error: true,
        message: err.message,
        interaction: true,
        devMode: urlHas(req.path, 'dev', true),
      };

      return res.render('login/login', locals);
    }
  }

  @Post('login/callback')
  async callback(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body,
  ) {
    console.log('login callback');

    const provider = await ctx.currentProvider();
    if (!provider) throw new NotFoundException('provider not found');

    const details = await provider.interactionDetails(req, res);
    if (!details) {
      throw new InvalidRequest(`interaction session not found`);
    }
    const { params } = details;
    console.log('login callback, interaction params: ', details);

    let profile_data;
    let federatedUser;
    let connectionName = params.connection;

    if (body.id_token) {
      const tokenSet = new TokenSet({
        id_token: body.id_token,
      });

      console.log('body.id_token: ', tokenSet.claims());
      const { sub, ...rest } = tokenSet.claims();
      profile_data = {
        ...rest,
        user_id: sub,
      };
    } else {
      const wctx = JSON.parse(body.wctx);
      const wresult = JSON.parse(body.wresult);
      console.log('body.wresult: ', wresult, wctx);

      connectionName = connectionName || wctx.connection;
      federatedUser = await this.userService.retrieve(ctx, wresult.accountId);
      if (!federatedUser) {
        throw new APIException(
          'invalid_request',
          `user ${federatedUser.user_id} not found`,
        );
      }
    }

    const connection = await this.connectionService.findByName(
      ctx,
      connectionName,
    );

    if (!connection) {
      throw new APIException(
        'invalid request',
        `connection of name ${connectionName} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!federatedUser) {
      const now = new Date();
      const identity = {
        user_id: profile_data.user_id,
        provider: connection.strategy,
        is_social: false,
        profile_data,
        connection: connection.name,
      } as IdentityDto;

      // TODO 还得判断用户是否存在
      federatedUser = await this.userService.findByConnection(
        ctx,
        connection.name,
        identity.user_id,
      );

      // 创建新用户
      if (!federatedUser) {
        Logger.debug(
          `没有找到 联合登录账户,  connection: ${connection.name}, user_id: ${identity.user_id}, nickname: ${identity.profile_data.nickname}`,
        );

        // 创建新user
        federatedUser = await this.userService.create(ctx, {
          user_id:
            identity.provider + '|' + connection.name + '|' + identity.user_id,
          name: identity.profile_data.name,
          connection: identity.connection,
          username: identity.profile_data.username,
          nickname: identity.profile_data.nickname,
          picture: identity.profile_data.picture,
          signup_ip: req.ip,
          signup_at: new Date(),
          last_login: now,
          identities: [identity],
        });
      } else {
        // 把 identity 合并到主 user
        // this.validateUser(federatedUser);

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
            username: profile_data.username,
            nickname: profile_data.nickname,
            gender: profile_data.gender,
            picture: profile_data.picture,
            last_login: now,
          } as Partial<UpdateUserDto>);
        } else {
          Logger.log(
            `不更新主档案 identity, strategy: ${connection.strategy}, user_id: ${federatedUser.user_id}`,
          );
        }
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

    const result: InteractionResults = {
      select_account: {},
      login: {
        accountId: federatedUser.user_id,
        acr: 'urn:mace:incommon:iap:bronze',
        amr: ['pwd'],
        remember: true,
        ts: Math.floor(Date.now() / 1000),
      },
      // consent was given by the user to the client for this session
      consent: {
        rejectedScopes: [], // array of strings, scope names the end-user has not granted
        rejectedClaims: [], // array of strings, claim names the end-user has not granted
      },
      meta: {},
    };

    if (params.protocol === 'samlp') {
      res.redirect(`/samlp/resume?state=${details.uid}`);
    } else {
      await provider.interactionFinished(req, res, result, {
        mergeWithLastSubmission: true,
      });
    }
  }

  @Post('login/:uid/2fa')
  public async interaction2faPost(
    @ReqCtx() ctx: IRequestContext,
    @Body() body,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const provider = await ctx.currentProvider();
    const details = await provider.interactionDetails(req, res);
    const user = await this.userService.retrieve(ctx, body.id);

    try {
      const inputToken = body.token;
      const isValid = await TwoFactorAuthUtils.isValid(
        inputToken,
        user.secret2fa,
      );

      if (isValid) {
        const result: InteractionResults = {
          select_account: {},
          login: {
            accountId: user.user_id,
            acr: 'urn:mace:incommon:iap:bronze',
            amr: ['pwd'],
            remember: true,
            ts: Math.floor(Date.now() / 1000),
          },
          // consent was given by the user to the client for this session
          consent: {
            rejectedScopes: [], // array of strings, scope names the end-user has not granted
            rejectedClaims: [], // array of strings, claim names the end-user has not granted
          },
          meta: {},
        };

        await provider.interactionFinished(req, res, result);
      } else {
        // Incorrect code provided
        throw new HttpException(
          'Token provided was incorrect; please try again',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      const locals = {
        title: 'Sign-in',
        details: details,
        email: user.email,
        user_id: user.user_id,
        error: true,
        message: err.message,
        result: JSON.stringify(body.result),
      };

      return res.render('2fa-auth', locals, (err, html) => {
        if (err) throw new HttpException(err, HttpStatus.BAD_REQUEST);

        res.render('_layout-simple', {
          ...locals,
          body: html,
        });
      });
    }
  }

  @Post('login/:uid/continue')
  public continuePost(@Param() params) {
    console.log(':uid/continue', 'continuePost', params);
  }

  @Post('login/:uid/invitation')
  async invitationPost(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const provider = await ctx.currentProvider();
    const _ctx = provider.app.createContext(req, res);

    const interactionDetails = await provider.interactionDetails(req, res);
    const {
      prompt: { name },
      params,
      session: { accountId },
    } = interactionDetails;
    assert.equal(name, 'invitation');

    // 接受邀请
    if (params.invitation && params.organization) {
      Logger.debug(
        `接受来自组织: ${params.organization} 的邀请: ${params.invitation}`,
      );
      const invitation = await this.invitationService.findByTicket(
        ctx,
        params.invitation,
      );
      if (!invitation) {
        throw new APIException('invalid_request', 'invitation not found');
      }

      const exsitingMember =
        await this.organizationMemberService.findByRelation(
          ctx,
          invitation.org_id,
          accountId,
        );
      if (!exsitingMember) {
        // 添加成员
        const member = await this.organizationMemberService.create(ctx, {
          organization: {
            id: invitation.org_id,
          },
          user: {
            tenant: ctx.tenant,
            user_id: accountId,
          },
        });
        // 给成员添加组角色
        await this.organizationMemberService.addRoles(
          ctx,
          member.id,
          invitation.roles,
        );
      }

      await this.invitationService.delete(ctx, invitation.id);
    }

    const result = { invitation: params.invitation };
    await provider.interactionFinished(req, res, result, {
      mergeWithLastSubmission: true,
    });
  }

  @Post('login/:uid/confirm')
  public async confirmPost(
    @ReqCtx() ctx: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    Logger.log('xxxconsent confirm');

    const provider = await ctx.currentProvider();

    const _ctx = provider.app.createContext(req, res);

    const interactionDetails = await provider.interactionDetails(req, res);
    const {
      prompt: { name, details },
      params,
      session: { accountId },
    } = interactionDetails;
    assert.equal(name, 'consent');

    let { grantId } = interactionDetails;
    let grant;

    if (grantId) {
      // we'll be modifying existing grant in existing session
      grant = await provider.Grant.find(_ctx, grantId);
    } else {
      // we're establishing a new grant
      grant = new provider.Grant({
        accountId,
        clientId: params.client_id,
      });
    }

    // TODO 这里要判断用户权限，而不是盲目添加 scope, 或者应该在先前就把权限过滤了

    // OIDC 权限
    if (details.missingOIDCScope) {
      grant.addOIDCScope(details.missingOIDCScope.join(' '));
    }

    // OIDC 声明
    if (details.missingOIDCClaims) {
      grant.addOIDCClaims(details.missingOIDCClaims);
    }

    // 资源权限
    if (details.missingResourceScopes) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [indicator, scopes] of Object.entries(
        details.missingResourceScopes,
      )) {
        grant.addResourceScope(indicator, (scopes as []).join(' '));
      }
    }

    grantId = await grant.save(_ctx);

    const consent: any = {};
    if (!interactionDetails.grantId) {
      // we don't have to pass grantId to consent, we're just modifying existing one
      consent.grantId = grantId;
    }

    const result = { consent };
    await provider.interactionFinished(req, res, result, {
      mergeWithLastSubmission: true,
    });
  }

  @Post('login/:uid/abort')
  public abortPost(@Param() params) {
    console.log(':uid/abort', 'abortPost', params);
  }
}
