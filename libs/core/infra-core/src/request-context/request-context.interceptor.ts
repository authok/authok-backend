import {
  Injectable,
  Logger,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { RequestContext } from './request-context.dto';
import { OidcService } from 'libs/oidc/provider/src/lib/services/oidc.service';
import { ITenantService } from 'libs/api/infra-api/src';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(
    private oidcService: OidcService,
    @Inject('ITenantService')
    private readonly tenantService: ITenantService,
  ) {
    Logger.log('request-context interceptor inited');
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    Logger.debug(`========== request-context intercept, path: ${req.path}`);

    const requestContext = new RequestContext(req, res);

    try {
      let tenantName;
      let region;
      if (req.user) {
        Logger.debug(`登录态从user iss 获取 tenant. iss: ${req.user.iss}`);
        const url = new URL(req.user.iss);
        const segments = url.hostname.split('.');
        tenantName = segments[0];
        region = segments[1];
      } else {
        console.log('非登录态从 url 获取 tenant', req.subdomains);
        tenantName = req.subdomains[req.subdomains.length - 1];
        region = req.subdomains[req.subdomains.length - 2];
      }

      Logger.debug(`当前租户: ${tenantName} ${region}`);
      const tenant = await this.tenantService.findByName({}, tenantName);
      if (!tenant) {
        throw new BadRequestException(`租户 ${region}.${tenantName} 不存在`);
      }

      requestContext.tenant = tenant.id;

      requestContext.currentProvider = async () => {
        // 1. 请求级别重用
        if (requestContext.provider) return requestContext.provider;

        const issuer = `https://${req.hostname}/`;

        const provider = await this.oidcService.findProvider(issuer);
        requestContext.provider = provider;

        return provider;
      };
    } catch (e) {
      requestContext.currentProvider = () => null;
      console.error(e);
    }

    return next.handle().pipe();
  }
}
