import { AdapterManager } from './adapter.manager';
import { IModelAdapter } from './model.adapter';

export type KindOfId = number | string;

export function injectAdapter(adapterManager: AdapterManager) {
  return class AdapterWrapper implements IModelAdapter {
    name: string;
    adapter: IModelAdapter;

    constructor(name: string) {
      this.name = name;
      this.adapter = adapterManager.get(name);
    }

    public async upsert(
      ctx: Record<string, any>,
      id: KindOfId,
      payload,
      expiresIn: number,
    ) {
      return await this.adapter.upsert(ctx, id, payload, expiresIn);
    }

    public async find(ctx: Record<string, any>, id: string) {
      return await this.adapter.find(ctx, id);
    }

    public async findByUserCode(ctx: Record<string, any>, userCode: KindOfId) {
      return await this.adapter.findByUserCode(ctx, userCode);
    }

    public async findByUid(ctx: Record<string, any>, uid: KindOfId) {
      return await this.adapter.findByUid(ctx, uid);
    }

    public async consume(ctx: Record<string, any>, id: KindOfId) {
      return await this.adapter?.consume(ctx, id);
    }

    public async destroy(ctx: Record<string, any>, id: KindOfId) {
      return await this.adapter.destroy(ctx, id);
    }

    public async revokeByGrantId(ctx: Record<string, any>, grantId: KindOfId) {
      return await this.adapter.revokeByGrantId(ctx, grantId);
    }
  };
}
