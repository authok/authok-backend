import {
  Injectable,
  ExecutionContext,
  CanActivate,
  Logger,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor() {
  }

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return false;

    // TODO 根据 userId 找到其关联的 tenants
    
    Logger.debug(`path: ${req.path}, user_id: ${user.sub}, org_id: ${user.org_id}`);

    return !!user.org_id;
  }
}
