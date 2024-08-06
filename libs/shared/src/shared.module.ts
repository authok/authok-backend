import { Module, Global } from '@nestjs/common';
import { PromisifyHttpService } from './services/promisifyHttp.service';
import { PhoneParser } from './services/phone.parser';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [PromisifyHttpService, PhoneParser],
  exports: [PromisifyHttpService, PhoneParser],
})
export class SharedModule {}
