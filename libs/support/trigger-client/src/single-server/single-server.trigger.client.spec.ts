import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SingleServerTriggerClient } from './single-server.trigger.client';
import { TriggerResult } from '@authok/action-core-module';

describe('Mailer', () => {
  let triggerClient: SingleServerTriggerClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({
            TRIGGER_HOST: 'http://localhost:3008',
          })],
        }),
      ],
      providers: [
        SingleServerTriggerClient,
      ],
    }).compile();

    triggerClient = module.get(SingleServerTriggerClient);
  });

  it('post-login', async () => {
    const result = await triggerClient.run<TriggerResult>('post-login', 'onPostLogin', {
      "secrets": {
          "MY_REDIRECT_SECRET": "123456"
      },
      "request": {
          "hostname": "a.us.authok.io",
          "ip": "12.2.2.2"
      },
      "user": {
          "user_id": "11334"
      }
    });

    console.log('result: ', result.commands);
  });
});
