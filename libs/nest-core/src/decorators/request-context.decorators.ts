import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestContext } from '../interfaces';

export const ReqCtx = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest();
    return request.customRequestContext as IRequestContext;
  },
);
