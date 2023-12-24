import { Response, Request } from 'express';

export function cors(req: Request, res: Response) {
  res.setHeader('access-control-allow-credentials', 'true');
  res.setHeader('access-control-allow-origin', req.headers.origin || '*');
  res.header(
    'access-control-allow-headers',
    'content-type,content-length, authorization,origin,accept,x-request-language,x-requested-with,authok-client',
  );
  res.header(
    'access-control-expose-headers',
    'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset',
  );

  res.header(
    'access-control-allow-methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );
}
