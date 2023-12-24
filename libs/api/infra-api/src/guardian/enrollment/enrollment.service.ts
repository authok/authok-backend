import { IRequestContext } from '@libs/nest-core';
import { Enrollment } from './enrollment.model';

export interface IEnrollmentService {
  create(ctx: IRequestContext, enrollment: Partial<Enrollment>): Promise<Enrollment>;

  retrieve(ctx: IRequestContext, id: string): Promise<Enrollment | undefined>;

  update(ctx: IRequestContext, enrollment: Partial<Enrollment>): Promise<Enrollment>;

  delete(ctx: IRequestContext, id: string): Promise<void>;
}