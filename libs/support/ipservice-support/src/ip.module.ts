import { Module, Global } from '@nestjs/common';
import { TaobaoIPService } from './providers/taobao/taobao.ip.service';
import { IPStackIPService } from './providers/ipstack/ipstack.ip.service';
import { MixIPService } from './mix.ip.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'IPService',
      useClass: MixIPService,
    },
    {
      provide: 'ipstack_ipservice',
      useClass: IPStackIPService,
    },
    {
      provide: 'taobao_ipservice',
      useClass: TaobaoIPService,
    }
  ],
  exports: [
    'IPService',
    'ipstack_ipservice',
    'taobao_ipservice',
  ],
})
export class IPModule {}
