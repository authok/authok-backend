import { Injectable, Inject } from '@nestjs/common';
import { IConfiguration } from '../configuration.builder';
const {
  interactionPolicy: { Prompt, Check, base },
} = require('@authok/oidc-provider');
import { InvalidRequest } from '@authok/oidc-provider/lib/helpers/errors';

import { 
  IOrganizationMemberService,
  IOrganizationService,
  IInvitationService,
} from 'libs/api/infra-api/src';
import { IExtension } from '../../extention';
import { IContext } from '@libs/nest-core';

@Injectable()
export class InteractionExtension implements IExtension<IConfiguration> {
  constructor(
    @Inject('IOrganizationService')
    private readonly organizationService: IOrganizationService,

    @Inject('IOrganizationMemberService')
    private readonly organizationMemberService: IOrganizationMemberService,
    @Inject('IInvitationService')
    private readonly invitationService: IInvitationService,
  ) {}

  extend(ctx: IContext, configuration: IConfiguration) {
    const basePolicy = base();

    const invitationCheck = new Check(
      'invitation',
      'need_confirm_invitation',
      async (ctx) => {
        // 已经完成了邀请
        if (ctx.oidc.result && ctx.oidc.result.invitation) {
          return false;
        }

        if (ctx.oidc.params.invitation) {
          const invitation = await this.invitationService.findByTicket(
            ctx.req.customRequestContext,
            ctx.oidc.params.invitation,
          );
          if (!invitation) {
            throw new InvalidRequest(
              `invitation ${ctx.oidc.params.invitation} not found`,
            );
          } else {
            return true;
          }
        }
        return false;
      },
      ({ oidc }) => ({
        invitation: oidc.params.invitation,
      }),
    );

    const invitation = new Prompt(
      { name: 'invitation', requestable: true },
      invitationCheck,
    );

    basePolicy.add(invitation);

    // 必须在邀请之后检查组织

    const organizationCheck = new Check(
      'org_not_exists',
      'organization not found',
      async (ctx) => {
        if (ctx.oidc.params.organization) {
          const organization = await this.organizationService.retrieve(
            ctx.req.customRequestContext,
            ctx.oidc.params.organization,
          );
          if (!organization) {
            throw new InvalidRequest(
              `organization ${ctx.oidc.params.organization} not found`,
            );
          }
        }
        return false;
      },
      ({ oidc }) => ({ organization: oidc.params.organization }),
    );

    const orgMemberCheck = new Check(
      'org_member_not_exists',
      'organization member not found',
      async (ctx) => {
        if (ctx.oidc.params.organization && ctx.oidc.session.accountId) {
          const member = await this.organizationMemberService.findByRelation(
            ctx.req.customRequestContext,
            ctx.oidc.params.organization,
            ctx.oidc.session.accountId,
          );
          if (!member) {
            throw new InvalidRequest(
              `user ${ctx.oidc.session.accountId} is not a member of organization ${ctx.oidc.params.organization}`,
            );
          }
        }
        return false;
      },
      ({ oidc }) => ({
        organization: oidc.params.organization,
        user_id: oidc.session.accountId,
      }),
    );

    const organization = new Prompt(
      { name: 'organization', requestable: true },
      organizationCheck,
      orgMemberCheck,
    );
    basePolicy.add(organization);

    configuration.set('interactions', {
      url(ctx, interaction) {
        // eslint-disable-line no-unused-vars
        return `/login?state=${interaction.uid}`;
      },
      policy: basePolicy,
    });
  }
}
