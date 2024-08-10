import { Test, TestingModule } from '@nestjs/testing';
import { TaobaoIPService } from './taobao.ip.service';
import { ConfigModule } from '@nestjs/config';

const configuration = () => ({
  taobao_ip: {
    access_key: 'alibaba-inc',
  }
});

describe('IPService', () => {
  let taobaoIPService: TaobaoIPService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
      ],
      providers: [
        {
          provide: 'taobao_ipservice',
          useClass: TaobaoIPService,
        }
      ],
    }).compile();

    taobaoIPService = module.get<TaobaoIPService>('taobao_ipservice');
  });


  it('Fetch location', async () => {
    const ip = '115.44.118.125';
    const r = await taobaoIPService.fetch(ip);
    console.log('地理位置: ', r);
  });
});
