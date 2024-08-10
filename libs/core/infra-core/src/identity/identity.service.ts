import { IContext, IRequestContext } from '@libs/nest-core';
import { 
  IIdentityService,
  IIdentityRepository,
  IdentityModel,
} from 'libs/api/infra-api/src';
import { Inject, NotFoundException } from '@nestjs/common';

export class IdentityService implements IIdentityService {
  constructor(
    @Inject('IIdentityRepository')
    private readonly identityRepository: IIdentityRepository,
  ) {}

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<IdentityModel | undefined> {
    return await this.identityRepository.retrieve(ctx, id);
  }

  async findByConnection(
    ctx: IContext,
    connection: string,
    userId: string,
  ): Promise<IdentityModel | undefined> {
    return this.identityRepository.findByConnection(
      ctx,
      connection,
      userId,
    );
  }

  async update(
    ctx: IContext,
    id: string,
    identity: Partial<IdentityModel>,
  ): Promise<IdentityModel> {
    const { affected } = await this.identityRepository.update(ctx, {
      ...identity,
      id,
    });
    if (!affected) {
      throw new NotFoundException(`Identity ${identity.id} not found`);
    }

    return await this.identityRepository.retrieve(ctx, id);
  }
}
