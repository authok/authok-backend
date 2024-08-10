import { Module } from '@nestjs/common';
import { TriggerController } from './controllers/trigger.controller';
import { ActionModule } from '@authok/action-core-module';
import * as path from "path";

@Module({
  imports: [
    ActionModule.register({
      scriptPath: process.env.SCRIPT_PATH || path.join(process.cwd(), "actions")
    }),
  ],
  controllers: [TriggerController],
  providers: [],
})
export class AppModule {}
