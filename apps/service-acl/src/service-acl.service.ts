import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceAclService {
  getHello(): string {
    return 'Hello World!';
  }
}
