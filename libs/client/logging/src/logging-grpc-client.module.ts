import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from 'path';
import { LogService } from "./logging.service";
import { LogStreamService } from "./logstream.service";


export const LOGGING_GRPC_CLIENT = 'logging_grpc_client'

@Global()
@Module({
  imports: [
  
  ],
  providers: [
    {
      provide: 'ILogService',
      useClass: LogService,
    },
    {
      provide: 'ILogStreamService',
      useClass: LogStreamService,
    },
  ],
  exports: [
    'ILogService',
    'ILogStreamService',
  ]
})
export class LoggingGrpcClientModule {
}