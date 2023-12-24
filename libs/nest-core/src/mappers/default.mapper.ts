import { Class } from '../common';
import { ClassTransformerMapper } from './class-transformer.mapper';

/**
 * DefaultMapper used when an Mapper was not defined.
 */
export class DefaultMapper<DTO, Entity> extends ClassTransformerMapper<DTO, Entity> {
  constructor(DTOClass: Class<DTO>, EntityClass: Class<Entity>) {
    super(DTOClass, EntityClass);
  }
}