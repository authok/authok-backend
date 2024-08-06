import { Module } from "@nestjs/common";
import { TenantTypeOrmModule } from "@libs/support/tenant-support-typeorm/tenant-typeorm.module";
import { ConfigModule } from "@nestjs/config";
import { TenantServiceModule } from "libs/core/tenant-service/src/tenant-service.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { TenantController } from "./controllers/tenant.controller";




@Module({
  controllers: [
    TenantController,
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    TenantServiceModule,
    TenantTypeOrmModule,
  ]
})
export class AppModule {}