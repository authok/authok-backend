import { Module, Global } from '@nestjs/common';
import { RestfulTenantService } from './restful.tenant.service';
import { RestfulConnectionService } from './restful.connection.service';
import { RestfulClientService } from './restful.client.service';
import { RestfulKeyService } from './restful.key.service';
import { RestfulApiService } from './restful.api.service';
import { RestfulDeviceService } from './restful.device.service';
import { RestfulOrganizationService } from './restful.organization.service';
import { RestfulUserService } from './restful.user.service';
import { RestfulSecretQuestionService } from './restful.secret-question.service';

@Global()
@Module({
  providers: [
    {
      provide: 'ITenantService',
      useClass: RestfulTenantService,
    },
    {
      provide: 'IKeyService',
      useClass: RestfulKeyService,
    },
    {
      provide: 'IResourceServerService',
      useClass: RestfulApiService,
    },
    {
      provide: 'IConnectionService',
      useClass: RestfulConnectionService,
    },
    {
      provide: 'IDeviceService',
      useClass: RestfulDeviceService,
    },
    {
      provide: 'IClientService',
      useClass: RestfulClientService,
    },
    {
      provide: 'IOrganizationService',
      useClass: RestfulOrganizationService,
    },
    {
      provide: 'IUserService',
      useClass: RestfulUserService,
    },
    {
      provide: 'ISecretQuestionService',
      useClass: RestfulSecretQuestionService,
    },
  ],
  exports: [
    'ITenantService',
    'IKeyService',
    'IResourceServerService',
    'IConnectionService',
    'IDeviceService',
    'IClientService',
    'IOrganizationService',
    'IUserService',
    'ISecretQuestionService',
  ],
})
export class InfraRpcClientRestfulModule {}
