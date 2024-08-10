import { Module } from '@nestjs/common';
import { SharedModule } from 'libs/shared/src/shared.module';
import { JobController } from './job.controller';

@Module({
  imports: [SharedModule],
  controllers: [JobController],
  providers: [],
  exports: [],
})
export class JobModule {}
