import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MgmtApiServerModule } from './mgmt-api-server.module';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { auth } from 'express-oauth2-bearer';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import * as jwks from 'jwks-rsa';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    MgmtApiServerModule,
  );

  // 这个必须放在 auth之前，最好一直在最前面, 链式处理，过滤掉 options 等
  app.disable('x-powered-by');
  app.enableCors();

  if (process.env.PROXY) {
    Logger.log('enabling express trust proxy setting');
    app.enable('trust proxy');
  }

  const audience = process.env.AUTHOK_AUDIENCE; // https://mgmt.authok.io/api/v2/
  const issuer = process.env.AUTHOK_ISSUER; // 'https://mgmt.us.authok.io/';

  const jwtCheck = expressjwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${issuer}.well-known/jwks.json`,
    }) as GetVerificationKey,
    audience,
    issuer,
    algorithms: ['RS256'],
  });
  app.use('/api', jwtCheck);

  const port = process.env.PORT || 3005;

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}
bootstrap();
