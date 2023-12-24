import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as urljoin from 'url-join';
import { IPService } from '../../ip.service';
import axios from 'axios';
import { IpInfo } from 'tencentcloud-sdk-nodejs/tencentcloud/services/bmvpc/v20180625/bmvpc_models';

@Injectable()
export class IPStackIPService implements IPService {
  private apiUrl: string;
  private access_key: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get('ipstack.url');
    this.access_key = this.configService.get('ipstack.access_key');
  }

  async fetch(ip: string): Promise<IpInfo> {
    const url = urljoin(this.apiUrl, ip, '?access_key=' + this.access_key);

    const r = await axios.get(url);
    return r.data;
  }
}
