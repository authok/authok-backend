import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPInfo } from '../../types';

interface TaobaoIPInfo {
  area: string; // '',
  country: string; // '中国',
  isp_id: string; // '100076',
  queryIp: string; // '115.44.118.125',
  city: string; // '深圳',
  ip: string; // '115.44.118.125',
  isp: string; // '天威',
  county: string; // '',
  region_id: string; // '440000',
  area_id: string; // '',
  county_id: string; // null,
  region: string; // '广东',
  country_id: string; // 'CN',
  city_id: string; // '440300'
}

interface TaobaoIPInfoResponse<T> {
  data: T;
}

@Injectable()
export class TaobaoIPService {
  private access_key: string;

  constructor(private readonly configService: ConfigService) {
    this.access_key = this.configService.get('taobao_ip.access_key');
  }

  async fetch(ip: string): Promise<IPInfo> {
    // const url = `https://ip.taobao.com/service/getIpInfo.php?accessKey=${this.access_key}&ip=${ip}`
    const url = `https://ip.taobao.com/outGetIpInfo?accessKey=${this.access_key}&ip=${ip}`;

    console.log('url: ', url);
    const r = await axios.get<TaobaoIPInfoResponse<TaobaoIPInfo>>(url);
    const info = r.data.data;
    console.log(r.data);
    return {
      ip: info.ip,
      country_name: info.country,
      country_code: info.country_id,
      city: info.city,
      region_name: info.region,
    } as IPInfo;
  }
}


