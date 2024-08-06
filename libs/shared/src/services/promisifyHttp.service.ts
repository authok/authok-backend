import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { HttpService } from '@nestjs/axios';

/**
 * Turn HttpService <Observable<Response<data>> into Promise<data>
 */
@Injectable()
export class PromisifyHttpService {
  constructor(private httpService: HttpService) {}

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.httpService
      .get<T>(url, config)
      .toPromise()
      .then((res) => res.data);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<any> {
    return this.httpService
      .post<T>(url, data, config)
      .toPromise()
      .then((res) => res.data);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<any> {
    return this.httpService
      .put<T>(url, data, config)
      .toPromise()
      .then((res) => res.data);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.httpService
      .delete<T>(url, config)
      .toPromise()
      .then((res) => res.data);
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<any> {
    return this.httpService
      .patch<T>(url, data, config)
      .toPromise()
      .then((res) => res.data);
  }
}
