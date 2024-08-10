import { NestFactory } from '@nestjs/core';
import { TaskCenterModule } from './task-center.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(TaskCenterModule);

  const port = process.env.PORT || 5006;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/');
  });
}
bootstrap();
