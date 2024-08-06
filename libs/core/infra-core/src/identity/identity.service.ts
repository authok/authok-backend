import { IRequestContext } from '@libs/nest-core';
import { IIdentityService } from 'libs/api/infra-api/src/identity/identity.service';
import { Inject, NotFoundException } from '@nestjs/common';
import { IIdentityRepository } from 'libs/api/infra-api/src/identity/identity.repository';
import { IdentityModel } from 'libs/api/infra-api/src/identity/identity.model';

export class IdentityService implements IIdentityService {
  constructor(
    @Inject('IIdentityRepository')
    private readonly identityRepository: IIdentityRepository,
  ) {}

  async retrieve(
    ctx: IRequestContext,
    id: string,
  ): Promise<IdentityModel | undefined> {
    return await this.identityRepository.retrieve(ctx, id);
  }

  async findByConnection(
    ctx: IRequestContext,
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
    ctx: IRequestContext,
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
