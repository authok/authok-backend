import { Injectable } from '@nestjs/common';
import { SecretQuestionModel, ISecretQuestionRepository } from 'libs/api/infra-api/src';
import { IContext } from '@libs/nest-core';
import { TenantAwareRepository } from '../../../../tenant-support-typeorm/src/modules/tenant/tenant-aware.repository';
import { SecretQuestionEntity, SecretAnswerEntity } from './secret-question.entity';

@Injectable()
export class TypeOrmSecretQuestionRepository
  extends TenantAwareRepository
  implements ISecretQuestionRepository {

  async findAll(ctx: IContext): Promise<Partial<SecretQuestionModel>[]> {
    const repo = await this.repo(ctx, SecretQuestionEntity);
    return repo.find();
  }

  async retrieve(
    ctx: IContext,
    id: string,
  ): Promise<SecretQuestionModel | undefined> {
    const repo = await this.repo(ctx, SecretQuestionEntity);
    return await repo.findOne({
      where: {
        id,
      }
    });
  }

  async create(
    ctx: IContext,
    secretQuestion: SecretQuestionModel,
  ): Promise<SecretQuestionModel> {
    const repo = await this.repo(ctx, SecretQuestionEntity);
    return await repo.save(secretQuestion);
  }

  async batchCreate(
    ctx: IContext,
    secretQuestions: Partial<SecretQuestionModel>[],
  ): Promise<Partial<SecretQuestionModel>[]> {
    const repo = await this.repo(ctx, SecretQuestionEntity);
    return await repo.save(secretQuestions);
  }

  async getUserQuestions(
    ctx: IContext,
    userId: string,
  ): Promise<Partial<SecretQuestionModel>[]> {
    const answerRepoRepo = await this.repo(ctx, SecretAnswerEntity);

    const questionsAndAnswers = await answerRepoRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    const questions: {
      text: string;
      id: string;
    }[] = [];

    const len = questionsAndAnswers.length;

    for (let i = 0; i < len; i++) {
      const secretAnswer = questionsAndAnswers[i];

      questions.push({
        id: secretAnswer.secretQuestion.id,
        text: secretAnswer.secretQuestion.text,
      });
    }

    return questions;
  }
}
