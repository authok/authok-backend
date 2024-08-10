import {
  Injectable,
  NestInterceptor,
  NotFoundException,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

@Injectable()
export class OIDCSessionInterceptor implements NestInterceptor {
  public async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const provider = await req.customRequestContext.currentProvider();
    if (!provider) throw new NotFoundException('provider not found');

    const ctx = provider.app.createContext(req, res);

    ctx.oidc = new provider.OIDCContext(ctx);

    ctx.oidc.session = new Proxy(await provider.Session.get(ctx), {
      set(obj, prop, value) {
        switch (prop) {
          case 'touched':
            Reflect.defineProperty(obj, 'touched', { writable: true, value });
            break;
          case 'destroyed':
            Reflect.defineProperty(obj, 'destroyed', {
              configurable: false,
              writable: true,
              value,
            });
            Reflect.defineProperty(obj, 'touched', {
              configurable: false,
              writable: false,
              value: false,
            });
            break;
          case 'accountId':
            if (typeof value !== 'string' || !value) {
              throw new TypeError(
                `accountId must be a non-empty string, got: ${typeof value}`,
              );
            }
          default:
            // eslint-disable-line no-fallthrough
            Reflect.set(obj, prop, value);
            const b = Reflect.defineProperty(obj, 'touched', {
              writable: true,
              value: true,
            });
        }

        return true;
      },
    });

    req.ctx = ctx;
    console.log('ttt0: ', ctx.oidc.session);

    return next.handle().pipe();
  }
}
