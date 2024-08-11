import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DBConnectionEntity } from './modules/db-connection/db-connection.entity';
import { TypeOrmDBConnectionRepository } from './modules/db-connection/db-connection.repository';
import { TenantEntity } from './modules/tenant/tenant.entity';
import { TypeOrmTenantRepository } from './modules/tenant/typeorm.tenant.repository';
import { TenantMapper } from './modules/tenant/tenant.mapper';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const type = configService.get('TENANCY_DRIVER', 'postgres')
        const host = configService.get('TENANCY_DB_HOST', 'localhost')
        const port = configService.get('TENANCY_DB_PORT', 5432)
        const username = configService.get('TENANCY_DB_USER', 'postgres')
        const password = configService.get('TENANCY_DB_PASSWORD', 'postgres')
        const database = configService.get('TENANCY_DB_DATABASE', 'authok_tenancy')
        const timezone = configService.get('TIMEZONE', 'Z')
        const logging = configService.get('TENANCY_DB_LOGGING', true)

        return {
          type,
          host,
          port,
          username,
          password,
          database,
          // entities: ['**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: false,
          timezone,
          logging,
          // cli: {
          //  migrationsDir: 'src/migrations',
          // },
        } as TypeOrmModuleOptions;
      },
    }),
    TypeOrmModule.forFeature([TenantEntity, DBConnectionEntity]),
  ],
  providers: [
    {
      provide: 'ITenantRepository',
      useClass: TypeOrmTenantRepository,
    },
    {
      provide: 'IDBConnectionRepository',
      useClass: TypeOrmDBConnectionRepository,
    },
    TenantMapper,
  ],
  exports: [
    'ITenantRepository',
    'IDBConnectionRepository',
  ],
})
export class TenantTypeOrmModule {}
