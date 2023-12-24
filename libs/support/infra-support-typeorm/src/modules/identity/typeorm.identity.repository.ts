import { Injectable } from '@nestjs/common';
import { IdentityDto } from 'libs/api/infra-api/src/identity/identity.dto';
import { IIdentityRepository } from 'libs/api/infra-api/src/identity/identity.repository';
import { IContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { IdentityEntity } from './identity.entity';

@Injectable()
export class TypeOrmIdentityRepository
  extends TenantAwareRepository
  implements IIdentityRepository {
  async update(
    ctx: IContext,
    identity: Partial<IdentityDto>,
  ): Promise<{ affected?: number }> {
    const identityRepo = await this.repo(ctx, IdentityEntity);
    return await identityRepo.update(identity.id, {
      ...identity,
      profile_data: identity.profile_data as any,
    });
  }

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<IdentityDto | undefined> {
    const identityRepo = await this.repo(ctx, IdentityEntity);
    return await identityRepo.findOne(id);
  }

  async findByConnection(
    ctx: IContext,
    connection: string,
    user_id: string,
  ): Promise<IdentityDto | undefined> {
    const repo = await this.repo(ctx, IdentityEntity);
    return await repo.findOne({
      where: {
        tenant: ctx.tenant,
        connection,
        user_id,
      },
    });
  }
}
