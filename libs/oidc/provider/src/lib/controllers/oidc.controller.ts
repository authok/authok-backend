import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { IRequestContext, ReqCtx } from '@libs/nest-core';

@Controller(OidcController.PREFIX)
export class OidcController {
  static PREFIX = '/oidc';

  @All('*')
  public async rewriteToProvider(
    @ReqCtx() requestContext: IRequestContext,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    req.url = req.originalUrl.replace(OidcController.PREFIX, '');

    const provider = await requestContext.currentProvider();
    const callback = provider.callback();
    return callback(req, res);
  }
}
