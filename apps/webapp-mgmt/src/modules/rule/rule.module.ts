import { Module } from '@nestjs/common';
import { SharedModule } from 'libs/shared/src/shared.module';
import { RuleController } from './rule.controller';

@Module({
  imports: [SharedModule],
  controllers: [RuleController],
  providers: [],
  exports: [],
})
export class RuleModule {}
