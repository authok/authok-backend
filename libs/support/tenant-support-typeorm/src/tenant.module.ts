import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DBConnection } from './modules/db-connection/db-connection.entity';
import { TypeOrmDBConnectionRepository } from './modules/db-connection/db-connection.repository';
import { TenantConnectionManager } from './modules/tenant/tenant.connection.manager';
import { TenantEntity } from './modules/tenant/tenant.entity';
import { TypeOrmTenantRepository } from './modules/tenant/typeorm.tenant.repository';
import { TenantMapper } from './modules/tenant/tenant.mapper';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: process.env.DRIVER || 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: +process.env.DB_PORT || 5432,
          username: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || 'root',
          database: process.env.DB_DATABASE || 'authok_mgmt',
          // entities: ['**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: !!process.env.DB_SYNCHRONIZE,
          timezone: process.env.TIMEZONE || 'Z',
          logging: process.env.DB_LOGGING !== 'false',
          // cli: {
          //  migrationsDir: 'src/migrations',
          // },
        } as TypeOrmModuleOptions;
      },
    }),
    TypeOrmModule.forFeature([TenantEntity, DBConnection]),
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
    {
      provide: 'IConnectionManager',
      useClass: TenantConnectionManager,
    },
    TenantMapper,
  ],
  exports: [
    'ITenantRepository',
    'IDBConnectionRepository',
    'IConnectionManager',
  ],
})
export class TenantModule {}
