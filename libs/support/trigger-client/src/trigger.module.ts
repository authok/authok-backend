import { Module, Global } from "@nestjs/common";
import { SingleServerTriggerClient } from "./single-server/single-server.trigger.client";
import { TriggerClient } from './trigger.client';

@Global()
@Module({
  providers: [
    {
      provide: 'SingleServerTriggerClient',
      useClass: SingleServerTriggerClient,
    },
    {
      provide: 'ITriggerClient',
      useClass: TriggerClient,
    }
  ],
  exports: [
    'ITriggerClient',
  ]
})
export class TriggerModule {}