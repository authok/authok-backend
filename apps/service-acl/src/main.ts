import { NestFactory } from '@nestjs/core';
import { ServiceAclModule } from './service-acl.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceAclModule);
  await app.listen(3000);
}
bootstrap();
