import { Global, Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from 'path';
import { CatalogService } from "./catalog.service";
import { CategoryService } from "./category.service";
import { FeatureService } from "./feature.service";
import { MARKETPLACE_PACKAGE_NAME } from "proto/stub/marketplace/catalog.pb";


const MARKETPLACE_GRPC_CLIENT = 'marketplace_grpc_client'

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: MARKETPLACE_GRPC_CLIENT,    
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get('MARKETPLACE_SERVICE_ENDPOINT', 'localhost:3005')
        return {
          transport: Transport.GRPC,
          options: {
            url,
            package: MARKETPLACE_PACKAGE_NAME,
            protoPath: [
              join('proto/marketplace/catalog.proto'),
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
      provide: 'ICatalogService',
      useClass: CatalogService,
    },
    {
      provide: 'ICategoryService',
      useClass: CategoryService,
    },
    {
      provide: 'IFeatureService',
      useClass: FeatureService
    }
  ],
  exports: [
    'ICatalogService',
    'ICategoryService',
    'IFeatureService',
  ]
})
export class MarketplaceGrpcClientModule {
}