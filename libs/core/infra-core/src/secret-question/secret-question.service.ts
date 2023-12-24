import { Inject, Injectable } from '@nestjs/common';
import { SecretQuestionDto } from 'libs/api/infra-api/src/secret-question/secret-question.dto';
import { ISecretQuestionRepository } from 'libs/api/infra-api/src/secret-question/secret-question.repository';
import { ISecretQuestionService } from 'libs/api/infra-api/src/secret-question/secret-question.service';
import { IRequestContext } from '@libs/nest-core';

@Injectable()
export class SecretQuestionService implements ISecretQuestionService {
  constructor(
    @Inject('ISecretQuestionRepository')
    private readonly secretQuestionRepo: ISecretQuestionRepository,
  ) {}

  async findAll(ctx: IRequestContext): Promise<Partial<SecretQuestionDto>[]> {
    throw this.secretQuestionRepo.findAll(ctx);
  }
}
