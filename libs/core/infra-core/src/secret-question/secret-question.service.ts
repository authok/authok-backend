import { Inject, Injectable } from '@nestjs/common';
import { 
  SecretQuestionModel, 
  ISecretQuestionRepository,
  ISecretQuestionService,
} from 'libs/api/infra-api/src';
import { IRequestContext } from '@libs/nest-core';

@Injectable()
export class SecretQuestionService implements ISecretQuestionService {
  constructor(
    @Inject('ISecretQuestionRepository')
    private readonly secretQuestionRepo: ISecretQuestionRepository,
  ) {}

  async findAll(ctx: IRequestContext): Promise<Partial<SecretQuestionModel>[]> {
    throw this.secretQuestionRepo.findAll(ctx);
  }
}
