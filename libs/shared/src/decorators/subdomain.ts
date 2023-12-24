import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SubDomain = createParamDecorator(
  (data: string, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    return req.subdomains[req.subdomains.length - 1];
  },
);
