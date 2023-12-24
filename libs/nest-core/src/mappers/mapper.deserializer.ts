import { Class, MetaValue, ValueReflector } from '../common';
import { MAPPER_DESERIALIZER_KEY } from './constants';

const reflector = new ValueReflector(MAPPER_DESERIALIZER_KEY);
// eslint-disable-next-line @typescript-eslint/ban-types
export type MapperDeserializer<T> = (obj: object) => T;
// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentional
export function AssemblerDeserializer<T>(deserializer: MapperDeserializer<T>) {
  return <Cls extends Class<T>>(cls: Cls): Cls | void => {
    if (reflector.isDefined(cls)) {
      throw new Error(`Mapper Deserializer already registered for ${cls.name}`);
    }
    reflector.set(cls, deserializer);
    return cls;
  };
}

export function getMapperDeserializer<DTO>(DTOClass: Class<DTO>): MetaValue<MapperDeserializer<DTO>> {
  return reflector.get(DTOClass, true);
}