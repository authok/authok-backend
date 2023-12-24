import axios from 'axios';
import { WeworkToken, WeworkDeptList, WeworkUserList } from './models';



export class WeworkAPI {
  private baseUrl = 'https://qyapi.weixin.qq.com/cgi-bin';

  constructor(
    private corpId: string,
    private secret: string,
  ) {}

  async fetchToken(): Promise<WeworkToken> {
    const url = `${this.baseUrl}/gettoken?corpid=${this.corpId}&corpsecret=${this.secret}`;

    const r = await axios.get<WeworkToken>(url);
    return r.data;
  }

  async fetchDeps(accessToken: string): Promise<WeworkDeptList> {
    const url = `${this.baseUrl}/department/list?access_token=${accessToken}`;
    const r = await axios.get<WeworkDeptList>(url);
    return r.data;
  }

  async fetchUserList(accessToken: string, department_id: string, fetch_child: number = 0): Promise<WeworkUserList> {
    const url = `${this.baseUrl}/user/list?access_token=${accessToken}&department_id=${department_id}&fetch_child=${fetch_child}`;

    const r = await axios.get<WeworkUserList>(url);
    return r.data;
  }
}