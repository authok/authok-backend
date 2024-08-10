import { Provider } from '@nestjs/common';
import { Mapper, getMapperClasses } from './mappers';
import { Class } from './common';
import { getQueryRepositoryToken } from './decorators';
import { getMapperQueryRepositoryToken } from './decorators/helpers';
import { MapperQueryRepository, QueryRepository } from './repositories';

function createRepositoryProvider<DTO, Entity, C, CE, U, UE>(
  MapperClass: Class<Mapper<DTO, Entity, C, CE, U, UE>>,
): Provider {
  const classes = getMapperClasses(MapperClass);
  if (!classes) {
    throw new Error(
      `unable to determine DTO and Entity classes for ${MapperClass.name}. Did you decorate your class with @Mapper`,
    );
  }
  const { EntityClass } = classes;

  return {
    provide: getMapperQueryRepositoryToken(MapperClass),
    useFactory(mapper: Mapper<DTO, Entity, C, CE, U, UE>, entityService: QueryRepository<Entity, CE, UE>) {
      return new MapperQueryRepository(mapper, entityService);
    },
    inject: [MapperClass, getQueryRepositoryToken(EntityClass)],
  };
}

export const createRepositories = (
  opts: Class<Mapper<unknown, unknown, unknown, unknown, unknown, unknown>>[],
): Provider[] => opts.map((opt) => createRepositoryProvider(opt));