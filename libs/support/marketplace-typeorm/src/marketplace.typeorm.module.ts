import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CatalogEntity } from './catalog/catalog.entity';
import { CategoryEntity } from './category/category.entity';
import { NestCoreModule } from '@libs/nest-core';
import { NestCoreTypeOrmModule } from '@libs/nest-core-typeorm';
import { CatalogMapper } from './catalog/catalog.mapper';
import { CategoryMapper } from './category/category.mapper';
import { FeatureEntity } from './feature/feature.entity';
import { FeatureMapper } from './feature/feature.mapper';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'authok_marketplace',
      useFactory: () => {
        return {
          type: process.env.DRIVER || 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: +process.env.DB_PORT || 5432,
          username: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || 'root',
          database: process.env.MARKETPLACE_DB_DATABASE || 'authok_marketplace',
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
    NestCoreModule.forFeature({
      global: true,
      imports: [
        NestCoreTypeOrmModule.forFeature(
          [CatalogEntity, CategoryEntity, FeatureEntity],
          'authok_marketplace',
        ),
      ],
      mappers: [CatalogMapper, CategoryMapper, FeatureMapper],
    }),
  ],
  providers: [],
  exports: [],
})
export class MarketplaceTypeOrmModule {}
