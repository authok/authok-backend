import { Logger, ValidationPipe, INestApplication, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import fs from 'fs';
import http from 'node:http';
import https from 'node:https';

import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ApiServerModule } from './api-server.module';
import { ManagementOpenApiModule } from 'libs/openapi/management-openapi/src/management.openapi.module';

async function createApp(server): Promise<INestApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    ApiServerModule,
    new ExpressAdapter(server),
  );

  app.disable('x-powered-by');
  app.use(
    cookieParser([
      'some secret key',
      'and also the old rotated away some time ago',
      'and one more',
    ]),
  );
  // app.use(helmet());
  // app.use(helmet.noSniff());
  app.use(helmet.hidePoweredBy());
  /*
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"]
    }
  }));
  */

  /*
  app.use((req, res, next) => {
    console.log('path', req.path);

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

    next();
  });
  */

  app.enableCors({
    origin(origin, callback) {
      callback(null, true);
    },
    credentials: true,
  });

  // 已经使用了 joi, 不需要用到这个
  /*
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true
  }));
  */

  const config = new DocumentBuilder()
    .setTitle('Authok Management OpenAPI')
    .setDescription('Authok Management OpenAPI')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: 'desc',
      name: 'name',
      // scheme?: string;
      bearerFormat: 'jwt',
    })
    .addTag('Authok Management OpenAPI')
    .build();

  const options: SwaggerDocumentOptions = {
    include: [ManagementOpenApiModule],
    deepScanRoutes: true,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs/management', app, document);

  /* 配置模板引擎，不用引入直接配置 */
  app.setBaseViewsDir(join(process.cwd(), 'apps/api-server/views'));
  app.setViewEngine('ejs');
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/static/',
  });

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  if (process.env.PROXY) {
    Logger.log('enabling express trust proxy setting');
    app.enable('trust proxy');
  }

  return app;
}

async function bootstrap() {
  const server = express();

  const port = process.env.PORT ?? 3003;

  const apiServer = await createApp(server);
  await apiServer.init();

  Logger.log('Listening at http ' + port);
  http.createServer(server).listen(port);

  if (process.env.ENV === 'DEV') {
    const httpsOptions = {
      key: fs.readFileSync('./cert/server.key'),
      cert: fs.readFileSync('./cert/server.cert'),
    };
    https.createServer(httpsOptions, server).listen(443);
    Logger.log('Listening at https 443');
  }


  /*
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/api');
    Logger.log('Graphql Listening at http://localhost:' + port + '/graphql');
  });
  */
}
bootstrap();
