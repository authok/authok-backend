import { IContext } from '@libs/nest-core';
import { IEnrollmentService, EnrollmentModel } from 'libs/api/infra-api/src';

export class EnrollmentService implements IEnrollmentService {
  async create(ctx: IContext, enrollment: Partial<EnrollmentModel>): Promise<EnrollmentModel> {
    return undefined;
  }

  async retrieve(ctx: IContext, id: string): Promise<EnrollmentModel | undefined> {
    return undefined;
  }

  async update(ctx: IContext, enrollment: Partial<EnrollmentModel>): Promise<EnrollmentModel> {
    return undefined;
  }

  async  delete(ctx: IContext, id: string): Promise<void> {

  }
}