import { IRequestContext } from '@libs/nest-core';
import { IEnrollmentService } from 'libs/api/infra-api/src/guardian/enrollment/enrollment.service';
import { Enrollment } from 'libs/api/infra-api/src/guardian/enrollment/enrollment.model';

export class EnrollmentService implements IEnrollmentService {
  async create(ctx: IRequestContext, enrollment: Partial<Enrollment>): Promise<Enrollment> {
    return undefined;
  }

  async retrieve(ctx: IRequestContext, id: string): Promise<Enrollment | undefined> {
    return undefined;
  }

  async update(ctx: IRequestContext, enrollment: Partial<Enrollment>): Promise<Enrollment> {
    return undefined;
  }

  async  delete(ctx: IRequestContext, id: string): Promise<void> {

  }
}