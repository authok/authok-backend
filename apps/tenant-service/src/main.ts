import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const host = process.env.HORT ?? '0.0.0.0';
  const port = process.env.PORT || 3005;

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${host}:${port}`,
      package: 'tenant',
      protoPath: join('proto/tenant/tenant.proto'),
    },
  });

  /*
  microservice.useGlobalFilters(new AllMicroserviceExceptionsFilter());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  */
 
  Logger.log(`Listening at ${host}:${port}`);

  await microservice.listen();
}
bootstrap();
