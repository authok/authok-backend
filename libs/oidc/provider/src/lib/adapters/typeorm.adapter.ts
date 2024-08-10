import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, EntityTarget, FindOptionsWhere } from 'typeorm';

import {
  IRequiredEntityAttrs,
  KindOfId,
  TypeORMEntities,
} from 'libs/oidc/common/src';
import { TenantConnectionManager } from 'libs/tenant-connection-manager/src/tenant.connection.manager';
import { IModelAdapter } from './model.adapter';
import { IRequestContext } from '@libs/nest-core';

/**
 * Used for storing issued tokens, codes, user sessions, etc
 * https://github.com/panva/node-oidc-provider/tree/master/docs#adapter
 */
export class TypeOrmAdapter implements IModelAdapter {
  private name: string;
  private entityType: TypeORMEntities;
  private tenantConnectionManager: TenantConnectionManager;

  public grantable: Set<string> = new Set([
    'AccessToken',
    'AuthorizationCode',
    'RefreshToken',
    'DeviceCode',
  ]);

  /**
   * Creates an instance of OidcAdapter.
   */
  constructor(
    name: string,
    entityType: TypeORMEntities,
    tenantConnectionManager: TenantConnectionManager,
  ) {
    this.name = name;
    this.entityType = entityType;
    this.tenantConnectionManager = tenantConnectionManager;
    console.log('xxx: ', this.entityType);
  }

  async repo<T>(
    ctx: IRequestContext,
    type: EntityTarget<T>,
  ): Promise<Repository<T>> {
    const connection = await this.tenantConnectionManager.get(ctx);
    return await connection.getRepository(type);
  }

  public grantKeyFor(id: string) {
    return `grant:${id}`;
  }

  public sessionUidKeyFor(id: string) {
    return `sessionUid:${id}`;
  }

  public key(id: KindOfId) {
    return `${this.name}:${id}`;
  }

  public async upsert(
    ctx: Record<string, any>,
    id: KindOfId,
    payload: OIDCUpsertPayload,
    expiresIn: number,
  ) {
    const repo = await this.repo<IRequiredEntityAttrs>(
      ctx.req.customRequestContext,
      this.entityType,
    );

    console.log('upsertxxx', this.name, payload, payload.grantId);

    await repo
      .save({
        id,
        data: JSON.stringify(payload),
        ...(payload.grantId ? { grantId: payload.grantId } : undefined),
        ...(payload.userCode ? { userCode: payload.userCode } : undefined),
        ...(payload.uid ? { uid: payload.uid } : undefined),
        ...(expiresIn
          ? { expiresAt: new Date(Date.now() + expiresIn * 1000) }
          : undefined),
        added: new Date(),
        clientId: payload.clientId ? payload.clientId : undefined,
      })
      .catch((typeOrmErr) => {
        throw new HttpException(typeOrmErr, HttpStatus.PARTIAL_CONTENT);
      });
  }

  public async find(ctx: Record<string, any>, id: string) {
    console.log('typeorm.adapter find: ', id, this.name);
    const repo = await this.repo<IRequiredEntityAttrs>(
      ctx.req.customRequestContext,
      this.entityType,
    );

    const found: IRequiredEntityAttrs = await repo.findOne({
      where: {
        id,
      }
    });

    console.log('client found: ', found);

    if (!found) {
      return undefined;
    }

    if (found.data) {
      const data = JSON.parse(found.data);
      const token = {
        ...data,
        ...(found.consumedAt
          ? {
              consumed: true,
            }
          : undefined),
      };
      return token;
    } else {
      return found;
    }
  }

  public async findByUserCode(ctx: Record<string, any>, userCode: KindOfId) {
    const repo = await this.repo<IRequiredEntityAttrs>(
      ctx.req.customRequestContext,
      this.entityType,
    );

    const found = await repo.findOne({
      where: {
        userCode: userCode as string,
      },
    });

    if (!found) {
      return undefined;
    }

    const data = JSON.parse(found.data);

    return {
      ...data,
      ...(found.consumedAt ? { consumed: true } : undefined),
    };
  }

  public async findByUid(ctx: Record<string, any>, uid: KindOfId) {
    const repo = await this.repo<IRequiredEntityAttrs>(
      ctx.req.customRequestContext,
      this.entityType,
    );

    const found: IRequiredEntityAttrs = await repo.findOne({
      where: {
        uid: uid as string,
      },
    });

    if (!found) {
      return undefined;
    }

    const data = JSON.parse(found.data);

    if (data) {
      return {
        ...data,
        ...(found.consumedAt ? { consumed: true } : undefined),
      };
    } else {
      return {
        ...(found.consumedAt ? { consumed: true } : undefined),
      };
    }
  }

  public async consume(ctx: Record<string, any>, id: KindOfId) {
    const repo = await this.repo<IRequiredEntityAttrs>(
      ctx.req.customRequestContext,
      this.entityType,
    );

    const findCond: FindOptionsWhere<IRequiredEntityAttrs> = {
      id: `${id}`,
    };

    await repo.update(findCond, {
      consumedAt: new Date().toISOString(),
    });
  }

  public async destroy(ctx: Record<string, any>, id: KindOfId) {
    const repo = await this.repo<IRequiredEntityAttrs>(
      ctx.req.customRequestContext,
      this.entityType,
    );

    await repo
      .delete({
        grantId: `${id}`,
      })
      .catch((typeOrmErr) => {
        throw typeOrmErr;
      });
  }

  public async revokeByGrantId(ctx: Record<string, any>, grantId: KindOfId) {
    const repo = await this.repo<IRequiredEntityAttrs>(
      ctx.req.customRequestContext,
      this.entityType,
    );

    await repo.delete({
      grantId: `${grantId}`,
    });
  }
}

interface OIDCUpsertPayload {
  clientId?: string;
  accountId?: string;
  iat?: number;
  exp?: number;
  uid?: string;
  jti?: string;
  kind?: string;
  returnTo?: string;
  userCode?: string;
  params?: {
    client_id?: string;
    prompt?: string;
    redirect_uri?: string;
    response_type?: string;
    scope?: string;
    state?: string;
  };
  prompt?: {
    details?: {
      id_token_hint?: string;
      login_hint?: string;
      max_age?: number | string;
    };
    name: string;
    reasons?: string[];
  };
  grantId?: string;
}
