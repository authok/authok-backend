import { Controller, Query, Get, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { URL } from 'url';
import { decode } from 'jsonwebtoken';

/**
 * 供测试用
 */
@Controller()
export class HomeController {
  @Get()
  index() {
    return '';
  }

  @Get('foo')
  foo(
    @Query('state') state: string,
    @Query('session_token') session_token: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const decoded = decode(session_token) as any;
    console.log('decoded: ', decoded);

    const url = new URL('https://' + decoded.hostname + '/continue');
    url.searchParams.set('state', state);
    console.log('url: ', url.href);

    const other_data = '额外信息';

    const view = `
<form method="post" action="${url.href}">
  <h3>确认要登录吗? ${decoded?.title}</h3>
  <input type="hidden" name="session_token" value="${session_token}"/>
  <input type="hidden" name="other_data" value="${other_data}"/>
  <input type="submit" value="确认"/>
</form>
`;
    res.send(view);
  }
}
