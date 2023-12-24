import {
  Injectable,
  Logger,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

@Injectable()
export class ExpressJwtRequestContextInterceptor implements NestInterceptor {
  constructor(
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    const ctx: Record<string, any> = { req };
    if (req.user && req.user.org_id) {
      ctx.tenant = req.user.org_id;
    }
    req.customRequestContext = ctx;

    Logger.debug(`req.path: ${req.path}, jwt request-context interceptor, org_id: ${req.user?.org_id}`)

    return next.handle().pipe();
  }
}
