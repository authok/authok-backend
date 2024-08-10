import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  SecretQuestionModel,
  ISecretQuestionService,
} from 'libs/api/infra-api/src';
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

  findAll(): Promise<Partial<SecretQuestionModel>[]> {
    return this.promisifyHttp.get<Partial<SecretQuestionModel>[]>(`${this.serviceBaseUrl}/secret_questions`);
  }
}
