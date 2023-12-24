import { Class, DeepPartial } from '../common';
import { Mapper, getMappers } from './mapper';
import { DefaultMapper } from './default.mapper';

/**
 * Mapper Service used by query services to look up Mappers.
 */
export class MapperFactory {
  static getMapper<DTO, Entity, C = DeepPartial<DTO>, CE = DeepPartial<Entity>, U = C, UE = CE>(
    DTOClass: Class<DTO>,
    EntityClass: Class<Entity>,
  ): Mapper<DTO, Entity, C, CE, U, UE> {
    const MapperClasses = getMappers(DTOClass);
    if (MapperClasses) {
      const MapperClass = MapperClasses.get(EntityClass);
      if (MapperClass) {
        return new MapperClass() as Mapper<DTO, Entity, C, CE, U, UE>;
      }
      const keys = [...MapperClasses.keys()];
      const keysWithParent = keys.filter((k) => k.prototype instanceof EntityClass);
      if (keysWithParent.length === 1) {
        return this.getMapper(DTOClass, keysWithParent[0] as Class<Entity>);
      }
    }
    const defaultAssembler = new DefaultMapper(DTOClass, EntityClass);
    // if its a default just assume the types can be converted for all types
    return defaultAssembler as unknown as Mapper<DTO, Entity, C, CE, U, UE>;
  }
}