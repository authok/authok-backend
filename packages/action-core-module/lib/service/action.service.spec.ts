import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { ActionModule } from '../action.module';

describe('ActionService', () => {
  let actionService: ActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ActionModule
      ],
    }).compile();

    actionService = module.get(ActionService);
  });

  it('post-login', async () => {
    const result = await actionService.run('post-login', 'onPostLogin', {
      "secrets": {
          "MY_REDIRECT_SECRET": "123456"
      },
      "request": {
          "hostname": "a.us.authok.io",
          "ip": "12.2.2.2"
      },
      "user": {
          "user_id": "11334"
      },
      "code": `
exports.onPostLogin = async (event, api) => {
  console.log('invoke onPostLogin: ', event);

  api.user.setUserMetadata('foo', 'bar');
throw new Error('fff');
  const token = api.redirect.encodeToken({
    secret: event.secrets.MY_REDIRECT_SECRET,
    payload: {
      foo: 'foo',
      bar: 'bar',
    }
  });

  api.redirect.sendUserTo('http://www.foo.com', {
    query: { session_token: token }
  });
}
      `
    } as any);

    console.log('result: ', result);
  });
});
