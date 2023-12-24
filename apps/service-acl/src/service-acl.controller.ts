import { Controller, Get } from '@nestjs/common';
import { ServiceAclService } from './service-acl.service';

@Controller()
export class ServiceAclController {
  constructor(private readonly serviceAclService: ServiceAclService) {}

  @Get()
  getHello(): string {
    return this.serviceAclService.getHello();
  }
}
