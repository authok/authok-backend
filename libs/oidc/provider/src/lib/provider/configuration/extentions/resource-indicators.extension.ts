import { Injectable, Inject, Logger } from '@nestjs/common';
import { IConfiguration } from '../configuration.builder';
import { 
  IResourceServerService,
  IUserService,
} from 'libs/api/infra-api/src';
import { IExtension } from '../../extention';
import { IContext } from '@libs/nest-core';
import { PageQuery } from 'libs/common/src/pagination';

@Injectable()
export class ResourceIndicatorsExtension implements IExtension<IConfiguration> {
  constructor(
    @Inject('IResourceServerService')
    private readonly resourceServerService: IResourceServerService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  extend(ctx: IContext, configuration: IConfiguration) {
    const resourceIndicators = {
      enabled: true,
      defaultResource: (ctx, client, oneOf) => {
        if (client.grants && client.grants.length > 0) {
          console.log('默认 audience: ', client.grants[0].audience);

          return client.grants[0].audience;
        }
        return undefined;
      },
      getResourceServerInfo: async (ctx, identifier, client) => {
        const resourceServer =
          await this.resourceServerService.findByIdentifier(
            { tenant: client.tenant },
            identifier,
          );

        if (!resourceServer) {
          Logger.warn(
            `没有找到 ResourceServer, tenant: ${client.tenant}, identifier: ${identifier}`,
          );
          return null;
        }

        Logger.log(
          `找到 ResourceServer, tenant: ${client.tenant}, identifier: ${identifier}`,
        );

        let scope;
        if (true) {
          let accountId;
          // token 端点有 load grant
          if (ctx.oidc.grant) {
            console.warn(ctx.req.path, '有grant');
            accountId = ctx.oidc.grant.accountId;
          }

          // authorize 端点有 load session
          if (!accountId && ctx.oidc.session) {
            console.warn(ctx.req.path, '有session,  无grant');
            accountId = ctx.oidc.session.accountId;
          }

          if (accountId) {
            // 过滤用户权限
            const permissionPage = await this.userService.paginatePermissions(
              { tenant: ctx.oidc.client.tenant },
              accountId,
              {
                audience: identifier,
                page: 1,
                per_page: 1000,
              } as PageQuery,
            );

            scope = permissionPage.items
              .map((it) => it.permission_name)
              .join(' ');
            // console.log('getResourceServerInfo 获取到用户权限, scopes: ', ctx.req.path, scope);
          } else {
            console.error(
              '这里可能没有权限: ',
              ctx.req.path,
              ctx.oidc.requestParamScopes,
            );
            scope = undefined; // 客户端凭证，走 loadClientGrantScopes
            // scope = (api.scopes || []).map((it) => it.value).join(' ');
          }
        } else {
          scope = (resourceServer.scopes || []).map((it) => it.value).join(' ');
        }

        return {
          identifier: resourceServer.identifier,
          audience: resourceServer.identifier,
          scope,
          accessTokenTTL: resourceServer.token_lifetime || 86400,
          accessTokenFormat: 'jwt', // 不确定
          jwt: {
            sign: {
              alg: resourceServer.signing_alg || 'RS256',
            },
          },
        };
      },
      useGrantedResource: async (ctx, model) => {
        Logger.log('使用已授权的资源', model);
        // @param ctx - koa request context
        // @param model - depending on the request's grant_type this can be either an AuthorizationCode, BackchannelAuthenticationRequest,
        //                RefreshToken, or DeviceCode model instance.
        return true;
      },
    };

    configuration.set('features.resourceIndicators', resourceIndicators);
  }
}
