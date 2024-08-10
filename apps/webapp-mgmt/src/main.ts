import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WebAppMgmtModule } from './webapp-mgmt.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { setupOidcAuth } from '@authok/nestjs-openid-connect';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    WebAppMgmtModule,
  );
  setupOidcAuth(app);

  const port = process.env.PORT || 3001;

  /* 配置模板引擎，不用引入直接配置 */
  app.setBaseViewsDir(join(process.cwd(), 'apps/webapp-mgmt/views'));
  app.setViewEngine('ejs');

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/api');
    Logger.log('Graphql Listening at http://localhost:' + port + '/graphql');
  });
}
bootstrap();
