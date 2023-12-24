import { Test, TestingModule } from '@nestjs/testing';
import { WeworkAPI } from './wework.api';
import { WeworkToken } from './models';

describe('WeworkAPI', () => {
  let weworkAPI: WeworkAPI;
  let token: WeworkToken;

  beforeEach(async () => {
    weworkAPI = new WeworkAPI('ww524646b7889b370b', 'xCE0HCiK0QeITkBuEWzxw5sajlrWXDYOdMQm5kKeN10');
  
    token = await weworkAPI.fetchToken();
    console.log('获取到access_token: ', token);
  });

  it('获取部门', async () => {
    const depts = await weworkAPI.fetchDeps(token.access_token);
    console.log('depts: ', depts);
  });
});
