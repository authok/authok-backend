import { Injectable, Inject, Logger } from '@nestjs/common';
import { IConfiguration } from '../configuration.builder';
import { PageQueryDto } from 'libs/common/src/pagination';
import { 
  IResourceServerService,
  IUserService,
  IOrganizationMemberService,
} from 'libs/api/infra-api/src';
import { IExtension } from '../../extention';
import { IContext } from '@libs/nest-core';

@Injectable()
export class LoadGrantExtension implements IExtension<IConfiguration> {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('IOrganizationMemberService')
    private readonly organizationMemberService: IOrganizationMemberService,
    @Inject('IResourceServerService')
    private readonly resourceServerService: IResourceServerService,
  ) {}

  extend(ctx: IContext, configuration: IConfiguration) {
    const loadExistingGrant = async (ctx) => {
      const grantId =
        (ctx.oidc.result &&
          ctx.oidc.result.consent &&
          ctx.oidc.result.consent.grantId) ||
        ctx.oidc.session.grantIdFor(ctx.oidc.client.clientId);
      Logger.log(`loadExistingGrant 1. 加载grant, grantId: ${grantId}`);

      let resourceServer;
      if (ctx.oidc.params.audience) {
        resourceServer = await this.resourceServerService.findByIdentifier(
          { tenant: ctx.oidc.client.tenant },
          ctx.oidc.params.audience,
        );
      }

      let grant;
      if (grantId) {
        grant = await ctx.oidc.provider.Grant.find(ctx, grantId);
        if (!grant) {
          Logger.log(
            `loadExistingGrant 3. grant 已被删除, grantId: ${grantId}`,
          );

          // 已被删除
          return undefined;
        }
      } else {
        if (ctx.oidc.client.is_first_party) {
          Logger.debug(
            `应用 ${ctx.oidc.client.clientId} 开启了 第一方应用，跳过授权`,
          );

          if (
            resourceServer &&
            !resourceServer.skip_consent_for_verifiable_first_party_clients
          ) {
            Logger.debug(
              `当前是API请求, ResourceServer: ${resourceServer.identifier}, 但是不允许跳过第一方应用授权`,
            );
            return undefined;
          } else {
            if (!resourceServer) {
              Logger.debug(`不是API请求`);
            } else {
              Logger.debug(
                `API请求，或 ResourceServer ${resourceServer.identifier} 开启了 第一方应用: ${resourceServer.skip_consent_for_verifiable_first_party_clients}，跳过授权`,
              );
            }

            grant = new ctx.oidc.provider.Grant({
              clientId: ctx.oidc.client.clientId,
              accountId: ctx.oidc.session.accountId,
            });
            grant.addOIDCScope('openid email profile');
          }
        } else {
          Logger.debug(
            `应用 ${ctx.oidc.client.clientId} 未开启第一方应用，不允许跳过授权`,
          );
          return undefined;
        }

        /*
        // 这里不返回会导致出错，很奇怪，要追查下
        grant = new ctx.oidc.provider.Grant({
          clientId: ctx.oidc.client.clientId,
          accountId: ctx.oidc.session.accountId,
        });
        grant.addOIDCScope('openid email profile');
        */
      }

      if (resourceServer) {
        Logger.debug(
          `client: ${ctx.oidc.client.clientId}, is_first_party: ${ctx.oidc.client.is_first_party}, ${resourceServer.identifier}, enforce_policies: ${resourceServer.enforce_policies}, skip_consent_for_verifiable_first_party_clients: ${resourceServer.skip_consent_for_verifiable_first_party_clients}`,
        );
        // 如果是第一方授权，并且开启了RBAC, 则自动装载权限, 否则需要走consent流程
        if (
          ctx.oidc.client.is_first_party &&
          resourceServer.skip_consent_for_verifiable_first_party_clients &&
          resourceServer.enforce_policies
        ) {
          Logger.debug(
            `${resourceServer.identifier} 开启了RBAC权限，加载到grant`,
          );

          const org_id = ctx.oidc.session.authorizationFor(
            ctx.oidc.client.clientId,
          ).org_id;
          let permissions;
          if (org_id) {
            // 组权限
            const permissionPage =
              await this.organizationMemberService.listPermissions(
                ctx,
                org_id,
                ctx.oidc.account.profile.user_id,
                {
                  per_page: 1000,
                } as PageQueryDto,
              );
            permissions = permissionPage.items;
            console.log('查找组权限: ', permissions.length, resourceServer);
            grant.resources &&
              delete grant.resources[resourceServer.identifier];
          } else {
            // 个人权限
            const permissionPage = await this.userService.paginatePermissions(
              { tenant: ctx.oidc.client.tenant },
              ctx.oidc.account.profile.user_id,
              {
                audience: ctx.oidc.params.audience,
                page: 1,
                per_page: 1000,
              } as PageQueryDto,
            );
            permissions = permissionPage.items;
          }

          const scopes = new Set(
            (permissions || []).map((it) => it.permission_name),
          );
          grant.addResourceScope(resourceServer.identifier, scopes);

          // console.log('grant 加载权限', scopes);
          Logger.debug(`grant 加载权限数: ${scopes.size}`);
        } else {
          Logger.warn(`${resourceServer.identifier} 未开启RBAC权限`);
        }
      }
      await grant.save(ctx);

      return grant;
    };

    configuration.set('loadExistingGrant', loadExistingGrant);
  }
}
