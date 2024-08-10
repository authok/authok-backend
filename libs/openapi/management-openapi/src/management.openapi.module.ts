import { Module, Global } from '@nestjs/common';
import { RestfulManagementOpenApiModule } from './modules/restful/restful.management.openapi.module';

@Global()
@Module({
  imports: [RestfulManagementOpenApiModule],
})
export class ManagementOpenApiModule {}
