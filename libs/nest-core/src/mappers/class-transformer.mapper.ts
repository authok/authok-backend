import { plainToClass } from 'class-transformer';
import { AggregateQuery, AggregateResponse, Query } from '../interfaces';
import { AbstractMapper } from './abstract.mapper';
import { Class, DeepPartial } from '../common';
import { getMapperSerializer } from './mapper.serializer';
import { getMapperDeserializer } from './mapper.deserializer';

/**
 * Base mapper that uses class-transformer to transform to and from the DTO/Entity.
 */
export abstract class ClassTransformerMapper<
  DTO,
  Entity,
> extends AbstractMapper<
  DTO,
  Entity,
  DeepPartial<DTO>,
  DeepPartial<Entity>,
  DeepPartial<DTO>,
  DeepPartial<Entity>
> {
  convertToDTO(entity: Entity): DTO {
    return this.convert(this.DTOClass, this.toPlain(entity));
  }

  convertToEntity(dto: DTO): Entity {
    return this.convert(this.EntityClass, this.toPlain(dto));
  }

  convertQuery(query: Query<DTO>): Query<Entity> {
    return query as unknown as Query<Entity>;
  }

  convertAggregateQuery(
    aggregate: AggregateQuery<DTO>,
  ): AggregateQuery<Entity> {
    return aggregate as unknown as AggregateQuery<Entity>;
  }

  convertAggregateResponse(
    aggregate: AggregateResponse<Entity>,
  ): AggregateResponse<DTO> {
    return aggregate as unknown as AggregateResponse<DTO>;
  }

  convertToCreateEntity(create: DeepPartial<DTO>): DeepPartial<Entity> {
    return this.convert(this.EntityClass, create) as DeepPartial<Entity>;
  }

  convertToUpdateEntity(create: DeepPartial<DTO>): DeepPartial<Entity> {
    return this.convert(this.EntityClass, create) as DeepPartial<Entity>;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  convert<T>(cls: Class<T>, obj: object): T {
    const deserializer = getMapperDeserializer(cls);
    if (deserializer) {
      return deserializer(obj);
    }
    return plainToClass(cls, obj);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  toPlain(entityOrDto: Entity | DTO): object {
    if (entityOrDto && entityOrDto instanceof this.EntityClass) {
      const serializer = getMapperSerializer(this.EntityClass);
      if (serializer) {
        return serializer(entityOrDto);
      }
    } else if (entityOrDto instanceof this.DTOClass) {
      const serializer = getMapperSerializer(this.DTOClass);
      if (serializer) {
        return serializer(entityOrDto);
      }
    } else if ('constructor' in (entityOrDto as object)) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      const serializer = getMapperSerializer(
        (entityOrDto as unknown as object).constructor as Class<unknown>,
      );
      if (serializer) {
        return serializer(entityOrDto);
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    return entityOrDto as unknown as object;
  }
}
