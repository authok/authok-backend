import { Provider } from '@authok/oidc-provider';
import { IRequestContext } from '@libs/nest-core';
import { Request, Response } from 'express';

export class RequestContext implements IRequestContext {
  tenant: string;
  user: any;
  provider: Provider;

  req: Request;
  res: Response;

  currentProvider: () => Promise<Provider>;

  constructor(req, res) {
    this.req = req;
    this.res = res;

    req.customRequestContext = this;

    if (req.user) {
      const url = new URL(req.user.iss);
      this.user = req.user;
      console.log('req.user.tenant: ', url.host, url.hostname);
    }
  }
}
