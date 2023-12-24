import { Injectable } from '@nestjs/common';
import { SecretAnswerDto } from 'libs/api/infra-api/src/secret-question/secret-answer.dto';
import { ISecretAnswerRepository } from 'libs/api/infra-api/src/secret-question/secret-answer.repository';
import { IRequestContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { SecretAnswerEntity } from './secret-question.entity';

@Injectable()
export class TypeOrmSecretAnswerRepository
  extends TenantAwareRepository
  implements ISecretAnswerRepository {

  async retrieve(ctx: IRequestContext, id: string): Promise<SecretAnswerDto> {
    const repo = await this.repo(ctx, SecretAnswerEntity);
    const answer = await repo.findOne(id);
    return {
      ...answer,
      user_id: answer.user.user_id,
    };
  }

  async create(
    ctx: IRequestContext,
    secretAnswer: Partial<SecretAnswerDto>,
  ): Promise<SecretAnswerDto> {
    const repo = await this.repo(ctx, SecretAnswerEntity);
    const answer = await repo.save(secretAnswer);
    return {
      ...answer,
      user_id: answer.user.user_id,
    };
  }

  async batchCreate(
    ctx: IRequestContext,
    secretAnswers: Partial<SecretAnswerDto>[],
  ): Promise<SecretAnswerDto[]> {
    const repo = await this.repo(ctx, SecretAnswerEntity);
    const answers = await repo.save(secretAnswers);
    return answers.map((it) => ({
      ...it,
      user_id: it.user.user_id,
    }));
  }

  async findByUser(
    ctx: IRequestContext,
    user_id: string,
  ): Promise<Partial<SecretAnswerDto>[]> {
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
