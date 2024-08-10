import { Class, MetaValue, ValueReflector } from '../common';
import { MAPPER_SERIALIZER_KEY } from './constants';

const reflector = new ValueReflector(MAPPER_SERIALIZER_KEY);
// eslint-disable-next-line @typescript-eslint/ban-types
export type MapperSerializer<T> = (instance: T) => object;
// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentional
export function MapperSerializer<T>(serializer: MapperSerializer<T>) {
  return <Cls extends Class<T>>(cls: Cls): Cls | void => {
    if (reflector.isDefined(cls)) {
      throw new Error(`Mapper Serializer already registered for ${cls.name}`);
    }
    reflector.set(cls, serializer);
    return cls;
  };
}

export function getMapperSerializer<DTO>(DTOClass: Class<DTO>): MetaValue<MapperSerializer<DTO>> {
  return reflector.get(DTOClass, true);
}