import {
  Inject,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { IModelAdapter } from './model.adapter';
import { IGrantService, GrantModel } from 'libs/api/infra-api/src';

@Injectable()
export class GrantAdaptor implements IModelAdapter {
  constructor(
    @Inject('IGrantService')
    private readonly grantService: IGrantService,
  ) {
    console.warn('GrantAdaptor.ctor()');
  }

  async upsert(ctx: Record<string, any>, id: string, payload) {
    console.log('grant upsert', id, payload);

    const data = {
      ...(id && { id }),
      ...(payload.accountId && { user_id: payload.accountId }),
      ...(payload.clientId && { client_id: payload.clientId }),
      ...(payload.resources && { resources: payload.resources }),
      ...(payload.openid && { openid: payload.openid }),
      ...(payload.rejected && { rejected: payload.rejected }),
      ...(payload.data && { data: payload.data }),
      ...(payload.iat && { data: payload.iat }),
      ...(payload.exp && { data: payload.exp }),
      // ...(payload.tenant ? { tenant: payload.tenant } : undefined),
    };

    await this.grantService.create(ctx.req.customRequestContext, data);
  }

  async find(ctx: Record<string, any>, id: string) {
    const grant = await this.grantService.retrieve(
      ctx.req.customRequestContext,
      id,
    );

    if (!grant) {
      console.log('没有找到grant', id, ctx.oidc.session);
      try {
        throw new Error('test');
      } catch (e) {
        console.error(e);
      }
      return undefined;
    }

    console.log(`Grant finded: `, grant);

    const r = {
      id,
      jti: id,
      ...(grant.user_id && { accountId: grant.user_id }),
      ...(grant.client_id && { clientId: grant.client_id }),
      ...(grant.resources && { resources: grant.resources }),
      ...(grant.openid && { openid: grant.openid }),
      ...(grant.rejected && { rejected: grant.rejected }),
      ...(grant.data && { data: grant.data }),
      ...(grant.iat && { data: grant.iat }),
      ...(grant.exp && { data: grant.exp }),
      // ...(payload.tenant ? { tenant: payload.tenant } : undefined),
    };
    return r;
  }

  async destroy(ctx: Record<string, any>, id: string) {
    await this.grantService.delete(ctx.req.customRequestContext, id);
  }

  async findByUserCode(ctx: Record<string, any>, userCode: string) {
    throw new NotImplementedException('not need for client model');
  }

  async findByUid(ctx: Record<string, any>, uid: string) {
    throw new NotImplementedException('not need for client model');
  }

  async consume(ctx: Record<string, any>, id: string) {
    throw new NotImplementedException('not need for client model');
  }

  async revokeByGrantId(ctx: Record<string, any>, grantId: string) {
    throw new NotImplementedException('not need for client model');
  }
}
