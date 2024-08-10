import { IContext } from '@libs/nest-core';
import { EnrollmentModel } from './enrollment.model';

export interface IEnrollmentService {
  create(ctx: IContext, enrollment: Partial<EnrollmentModel>): Promise<EnrollmentModel>;

  retrieve(ctx: IContext, id: string): Promise<EnrollmentModel | undefined>;

  update(ctx: IContext, enrollment: Partial<EnrollmentModel>): Promise<EnrollmentModel>;

  delete(ctx: IContext, id: string): Promise<void>;
}