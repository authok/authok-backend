import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SecretQuestionDto } from 'libs/api/infra-api/src/secret-question/secret-question.dto';
import { ISecretQuestionService } from 'libs/api/infra-api/src/secret-question/secret-question.service';
import { PromisifyHttpService } from 'libs/shared/src/services/promisifyHttp.service';

@Injectable()
export class RestfulSecretQuestionService implements ISecretQuestionService {
  private serviceBaseUrl: string;

  constructor(
    private configService: ConfigService,
    private promisifyHttp: PromisifyHttpService,
  ) {
    this.serviceBaseUrl = this.configService.get<string>('services.baseUrl');
  }

  findAll(): Promise<Partial<SecretQuestionDto>[]> {
    return this.promisifyHttp.get<Partial<SecretQuestionDto>[]>(`${this.serviceBaseUrl}/secret_questions`);
  }
}
