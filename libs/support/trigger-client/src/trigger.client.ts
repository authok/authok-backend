import { ITriggerClient } from "./interface";
import { Inject } from "@nestjs/common";
import { SingleServerTriggerClient } from "./single-server/single-server.trigger.client";

export class TriggerClient implements ITriggerClient {
  constructor(
    @Inject('SingleServerTriggerClient') private readonly singleServerTriggerClient: SingleServerTriggerClient,
  ) {}

  async run<T>(trigger: string, func: string, event: any): Promise<T> {
    //if (process.env.ENV === 'DEV') {
      return await this.singleServerTriggerClient.run(trigger, func, event);
    //}
  }
}