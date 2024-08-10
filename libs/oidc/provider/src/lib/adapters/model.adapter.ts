import { KindOfId } from '@libs/oidc/common';

export interface IModelAdapter {
  upsert(ctx: Record<string, any>, id: KindOfId, payload, expiresIn: number);

  find(ctx: Record<string, any>, id: string);

  findByUserCode(ctx: Record<string, any>, userCode: KindOfId);

  findByUid(ctx: Record<string, any>, uid: KindOfId);

  consume(ctx: Record<string, any>, id: KindOfId);

  destroy(ctx: Record<string, any>, id: KindOfId);

  revokeByGrantId(ctx: Record<string, any>, grantId: KindOfId);
}
