import { NestFactory } from '@nestjs/core';
import { ServiceAuthModule } from './service-auth.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as Apollo from 'node-apollo';

async function bootstrap() {
  try {
    const {
      APOLLO_APPID,
      APOLLO_ENV,
      APOLLO_HOST,
      APOLLO_NAMESPACE,
      APOLLO_PORT,
      APOLLO_TOKEN,
      APOLLO_ClUSTER,
    } = process.env;

    console.log('APOLLO_HOST', `http://${APOLLO_HOST}:${APOLLO_PORT}`);
    const apolloConfig = {
      configServerUrl: `http://${APOLLO_HOST}:${APOLLO_PORT}`,
      appId: `${APOLLO_APPID}`,
      clusterName: `${APOLLO_ClUSTER}`,
      apolloEnv: `${APOLLO_ENV}`,
      token: `${APOLLO_TOKEN}`,
      namespaceName: [`${APOLLO_NAMESPACE}`],
    };

    // 获取到的配置信息
    const zmConf = await Apollo.remoteConfigService(apolloConfig);
    Logger.log(zmConf);
    process.env = Object.assign(process.env, zmConf);
  } catch (err) {
    Logger.log(`获取apollo远程配置异常:${err}`);
  }

  const app = await NestFactory.create(ServiceAuthModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('auth')
    .setDescription('The users service API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 5001;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}
bootstrap();
