import { Class } from '@libs/nest-core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';
import { Connection, ConnectionOptions } from 'typeorm';
import { createTypeOrmQueryServiceProviders, createMultitenancyTypeOrmQueryRepositoryProviders } from './providers';
import { IConnectionManager } from '@libs/nest-core/connection/connection.manager';

export class NestCoreTypeOrmModule {
  static forFeature(entities: Class<unknown>[], connection?: Connection | ConnectionOptions | string): DynamicModule {
    const queryServiceProviders = createTypeOrmQueryServiceProviders(entities, connection);
    const typeOrmModule = TypeOrmModule.forFeature(entities, connection);
    return {
      imports: [typeOrmModule],
      module: NestCoreTypeOrmModule,
      providers: [...queryServiceProviders],
      exports: [...queryServiceProviders, typeOrmModule],
    };
  }
}


export class NestCoreMultiTenancyTypeOrmModule {
  static forFeature(entities: Class<unknown>[], connectionManager: string): DynamicModule {
    const queryRepositoryProviders = createMultitenancyTypeOrmQueryRepositoryProviders(entities, connectionManager);
    return {
      module: NestCoreMultiTenancyTypeOrmModule,
      providers: [...queryRepositoryProviders],
      exports: [...queryRepositoryProviders],
    };
  }
}