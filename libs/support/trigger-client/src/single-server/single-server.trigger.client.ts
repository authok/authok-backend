import { ITriggerClient } from "../interface";
import axios from 'axios';
import { ConfigService } from "@nestjs/config";
import * as urljoin from 'url-join';
import { Injectable } from "@nestjs/common";

@Injectable()
export class SingleServerTriggerClient implements ITriggerClient {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async run<T>(trigger: string, func: string, event: any): Promise<T> {
    const host = process.env.TRIGGER_HOST || this.configService.get('trigger.host');
    
    let url;
    if (func) {
      url = urljoin(host, trigger, func);
    } else {
      url = urljoin(host, trigger);
    }
    console.log('发送trigger请求url: ', url);
    
    const response = await axios.post<T>(url, event);
    return response.data;
  }
}