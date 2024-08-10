import { Injectable, Inject } from "@nestjs/common";
import { IPService } from "./ip.service";
import { TaobaoIPService } from "./providers/taobao/taobao.ip.service";
import { IPStackIPService } from "./providers/ipstack/ipstack.ip.service";

@Injectable()
export class MixIPService implements IPService {
  constructor(
    @Inject('taobao_ipservice') private readonly taobaoIPService: TaobaoIPService,
    @Inject('ipstack_ipservice') private readonly ipstackIPService: IPStackIPService,
  ) {}

  fetch(ip: string): Promise<any> {
    // return this.taobaoIPService.fetch(ip);
    return this.ipstackIPService.fetch(ip);
  }
}