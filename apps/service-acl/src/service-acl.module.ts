import { Module } from '@nestjs/common';
import { ServiceAclController } from './service-acl.controller';
import { ServiceAclService } from './service-acl.service';

@Module({
  imports: [],
  controllers: [ServiceAclController],
  providers: [ServiceAclService],
})
export class ServiceAclModule {}
