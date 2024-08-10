import { Test, TestingModule } from '@nestjs/testing';
import { VM2SandboxService } from './sandbox.service';
import { ISandboxService } from 'libs/api/sandbox-api/src/sandbox.service';

describe('Sandbox', () => {
  let sandboxService: ISandboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ISandboxService',
          useClass: VM2SandboxService,
        },
      ],
    }).compile();

    sandboxService = module.get<ISandboxService>('ISandboxService');
  });


  it('run script', async () => {
    const code = `module.exports=function login(username, password, cb) {
      axios.get('https://www.baidu.com').then((r) => {
        // console.log('hello', r.data);
      });
      console.log('hello', config.host, config.port);

      cb(null, {
        user_id: 'uid32',
        nickname: 'haha',
      });
    }`;

    process.env.DB_HOST = 'localhost';
    process.env.DB_PWD = 'secret';
    console.log(process.env);

    const options = {
      builtin: [],
      states: {
        config: {
          host: '2.2.2.2',
          port: 3333,
        },
      },
    };
    const loginFn = await sandboxService.run<any>(code, options);

    const r = await new Promise((resolve, reject) => {
      const cb = (err, profile) => {
        console.log('profile: ', err, profile);

        if (err) reject(err);
        else resolve(profile);
      }

      loginFn('u1', 'p1', cb);
    });

    console.log('run script', r);
  });

  it('获取环境变量', async () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PWD = 'secret';

    // 这里无法拿到外部进程的环境变量
    const code = `module.exports = process.env`; 
    
    const options = {
      builtin: [],
      states: {
        config: {
          host: '2.2.2.2',
          port: 3333,
        },
      },
    };
    const env = await sandboxService.run<any>(code, options);
  
    console.log('env: ', env);
  })

  it('获取外部类型', async () => {
    // 这里无法拿到外部进程的环境变量
    const code = `module.exports = globalThis.VM2SandboxService`; 

    const options = {
      builtin: [],
      states: {
        config: {
          host: '2.2.2.2',
          port: 3333,
        },
      },
    };
    const clazz = await sandboxService.run<any>(code, options);
  
    console.log('clazz: ', clazz);
  })
});
