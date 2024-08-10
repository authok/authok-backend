import { Class, getQueryRepositoryToken } from '@libs/nest-core';
import { FactoryProvider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Connection, ConnectionOptions } from 'typeorm';
import { TypeOrmQueryRepository, TenantAwareTypeOrmQueryRepository } from './repositories';
import { IConnectionManager } from '@libs/nest-core/connection/connection.manager';

function createTypeOrmQueryRepositoryProvider<Entity>(
  EntityClass: Class<Entity>,
  connection?: Connection | ConnectionOptions | string,
): FactoryProvider {
  return {
    provide: getQueryRepositoryToken(EntityClass),
    useFactory(repo: Repository<Entity>) {
      return new TypeOrmQueryRepository(repo);
    },
    inject: [getRepositoryToken(EntityClass, connection)],
  };
}

export const createTypeOrmQueryServiceProviders = (
  entities: Class<unknown>[],
  connection?: Connection | ConnectionOptions | string,
): FactoryProvider[] => entities.map((entity) => createTypeOrmQueryRepositoryProvider(entity, connection));



function createMultitenancyTypeOrmQueryRepositoryProvider<Entity>(
  EntityClass: Class<Entity>,
  connectionManager: string,
): FactoryProvider {
  console.log('创建多租户Repository: ', getQueryRepositoryToken(EntityClass));
  return {
    provide: getQueryRepositoryToken(EntityClass),
    useFactory(connectionManager: IConnectionManager) {
      return new TenantAwareTypeOrmQueryRepository(EntityClass, connectionManager);
    },
    inject: [connectionManager],
  };
}

export const createMultitenancyTypeOrmQueryRepositoryProviders = (
  entities: Class<unknown>[],
  connectionManager: string,
): FactoryProvider[] => entities.map((entity) => createMultitenancyTypeOrmQueryRepositoryProvider(entity, connectionManager));