import { Injectable } from '@nestjs/common';
import { IContext, IRequestContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { SecretAnswerEntity } from './secret-question.entity';
import { ISecretAnswerRepository, SecretAnswerModel } from 'libs/api/infra-api/src';

@Injectable()
export class TypeOrmSecretAnswerRepository
  extends TenantAwareRepository
  implements ISecretAnswerRepository {

  async retrieve(ctx: IContext, id: string): Promise<SecretAnswerModel> {
    const repo = await this.repo(ctx, SecretAnswerEntity);
    const answer = await repo.findOne({
      where: { id },
    });
    return {
      ...answer,
      user_id: answer.user.user_id,
    };
  }

  async create(
    ctx: IContext,
    secretAnswer: Partial<SecretAnswerModel>,
  ): Promise<SecretAnswerModel> {
    const repo = await this.repo(ctx, SecretAnswerEntity);
    const answer = await repo.save(secretAnswer);
    return {
      ...answer,
      user_id: answer.user.user_id,
    };
  }

  async batchCreate(
    ctx: IRequestContext,
    secretAnswers: Partial<SecretAnswerModel>[],
  ): Promise<SecretAnswerModel[]> {
    const repo = await this.repo(ctx, SecretAnswerEntity);
    const answers = await repo.save(secretAnswers);
    return answers.map((it) => ({
      ...it,
      user_id: it.user.user_id,
    }));
  }

  async findByUser(
    ctx: IContext,
    user_id: string,
  ): Promise<Partial<SecretAnswerModel>[]> {
    const repo = await this.repo(ctx, SecretAnswerEntity);
    const answers = await repo.find({
      where: {
        user: {
          tenant: ctx.tenant,
          user_id: user_id,
        },
      },
    });

    return answers.map((it) => ({
      ...it,
      user_id: it.user.user_id,
    }));
  }
}