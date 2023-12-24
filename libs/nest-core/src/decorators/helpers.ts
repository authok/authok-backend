import { Mapper } from '../mappers';
import { Class } from '../common';

export function getQueryRepositoryToken(DTOClass: { name: string }): string {
  return `${DTOClass.name}QueryRepository`;
}

export function getMapperQueryRepositoryToken<DTO, Entity = unknown>(
  MapperClass: Class<Mapper<DTO, Entity, unknown, unknown, unknown, unknown>>,
): string {
  return `${MapperClass.name}QueryRepository`;
}