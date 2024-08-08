import { Global, Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientGrpcProxy, ClientsModule, RpcException, Transport } from "@nestjs/microservices";
import { TENANT_PACKAGE_NAME } from "proto/stub/tenant/tenant.pb";
import { join } from 'path';
import { TenantService } from "./tenant.service";
import { DBConnectionService } from "./db-connection.service";


const TENANT_GRPC_CLIENT = 'tenant_grpc_client'


class ErrorHandlingProxy extends ClientGrpcProxy {
  serializeError(err) {
    return new RpcException(err);
  }
}

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: TENANT_GRPC_CLIENT,    
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get('TENANT_SERVICE_ENDPOINT', 'localhost:3005')

        return {
          transport: Transport.GRPC,
          customClass: ErrorHandlingProxy,
          options: {
            url,
            package: TENANT_PACKAGE_NAME,
            protoPath: [
              join('proto/tenant/tenant.proto'),
            ],
            /*
            loader: {
              includeDirs: [join('proto')],
            },
            */
          }
        }
      }
    }])
  ],
  providers: [
    {
      provide: 'ITenantService',
      useClass: TenantService,
    },
    {
      provide: 'IDBConnectionService',
      useClass: DBConnectionService,
    },
  ],
  exports: [
    'ITenantService',
    'IDBConnectionService',
  ]
})
export class TenantGrpcClientModule {
}