import {
  Query,
  Class,
  MapperFactory,
  Filter,
  AggregateQuery,
  AggregateResponse,
  ModifyRelationOptions,
  FindRelationOptions,
  GetByIdOptions,
  IContext,
} from '@libs/nest-core';
import { Repository, RelationQueryBuilder as TypeOrmRelationQueryBuilder, ObjectLiteral } from 'typeorm';
import { filter, omit } from 'lodash';
import { AggregateBuilder, EntityIndexRelation, FilterQueryBuilder, RelationQueryBuilder } from '../query';

interface RelationMetadata {
  // eslint-disable-next-line @typescript-eslint/ban-types
  type: string | Function;
  isOneToOne: boolean;
  isManyToOne: boolean;
}

/**
 * Base class to house relations loading.
 * @internal
 */
export abstract class RelationQueryRepository<Entity> {
  abstract filterQueryBuilder: FilterQueryBuilder<Entity>;

  abstract EntityClass: Class<Entity>;

  abstract repo: Repository<Entity>;

  abstract getById(context: IContext, id: string | number, opts?: GetByIdOptions<Entity>): Promise<Entity>;

  /**
   * Query for relations for an array of Entities. This method will return a map with the Entity as the key and the relations as the value.
   * @param RelationClass - The class of the relation.
   * @param relationName - The name of the relation to load.
   * @param entities - the dtos to find relations for.
   * @param query - A query to use to filter, page, and sort relations.
   */
  async queryRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    entities: Entity[],
    query: Query<Relation>,
  ): Promise<Map<Entity, Relation[]>>;

  /**
   * Query for an array of relations.
   * @param RelationClass - The class to serialize the relations into.
   * @param dto - The dto to query relations for.
   * @param relationName - The name of relation to query for.
   * @param query - A query to filter, page and sort relations.
   */
  async queryRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: Entity,
    query: Query<Relation>,
  ): Promise<Relation[]>;

  async queryRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: Entity | Entity[],
    query: Query<Relation>,
  ): Promise<Relation[] | Map<Entity, Relation[]>> {
    if (Array.isArray(dto)) {
      return this.batchQueryRelations(context, RelationClass, relationName, dto, query);
    }
    const mapper = MapperFactory.getMapper(RelationClass, this.getRelationEntity(relationName));
    const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
    return mapper.convertAsyncToDTOs(relationQueryBuilder.select(dto, mapper.convertQuery(query)).getMany());
  }

  async aggregateRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    entities: Entity[],
    filter: Filter<Relation>,
    aggregate: AggregateQuery<Relation>,
  ): Promise<Map<Entity, AggregateResponse<Relation>[]>>;

  async aggregateRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: Entity,
    filter: Filter<Relation>,
    aggregate: AggregateQuery<Relation>,
  ): Promise<AggregateResponse<Relation>[]>;

  async aggregateRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: Entity | Entity[],
    filter: Filter<Relation>,
    aggregate: AggregateQuery<Relation>,
  ): Promise<AggregateResponse<Relation>[] | Map<Entity, AggregateResponse<Relation>[]>> {
    if (Array.isArray(dto)) {
      return this.batchAggregateRelations(context, RelationClass, relationName, dto, filter, aggregate);
    }
    const mapper = MapperFactory.getMapper(RelationClass, this.getRelationEntity(relationName));
    const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
    const aggResponse = await AggregateBuilder.asyncConvertToAggregateResponse(
      relationQueryBuilder
        .aggregate(dto, mapper.convertQuery({ filter }), mapper.convertAggregateQuery(aggregate))
        .getRawMany<Record<string, unknown>>(),
    );
    return aggResponse.map((agg) => mapper.convertAggregateResponse(agg));
  }

  async countRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    entities: Entity[],
    filter: Filter<Relation>,
  ): Promise<Map<Entity, number>>;

  async countRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: Entity,
    filter: Filter<Relation>,
  ): Promise<number>;

  async countRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: Entity | Entity[],
    filter: Filter<Relation>,
  ): Promise<number | Map<Entity, number>> {
    if (Array.isArray(dto)) {
      return this.batchCountRelations(context, RelationClass, relationName, dto, filter);
    }
    const mapper = MapperFactory.getMapper(RelationClass, this.getRelationEntity(relationName));
    const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
    return relationQueryBuilder.select(dto, mapper.convertQuery({ filter })).getCount();
  }

  /**
   * Find a relation for an array of Entities. This will return a Map where the key is the Entity and the value is to
   * relation or undefined if not found.
   * @param RelationClass - the class of the relation
   * @param relationName - the name of the relation to load.
   * @param dtos - the dtos to find the relation for.
   * @param opts - Additional options
   */
  async findRelation<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dtos: Entity[],
    opts?: FindRelationOptions<Relation>,
  ): Promise<Map<Entity, Relation | undefined>>;

  /**
   * Finds a single relation.
   * @param RelationClass - The class to serialize the relation into.
   * @param dto - The dto to find the relation for.
   * @param relationName - The name of the relation to query for.
   * @param opts - Additional options
   */
  async findRelation<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: Entity,
    opts?: FindRelationOptions<Relation>,
  ): Promise<Relation | undefined>;

  async findRelation<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: Entity | Entity[],
    opts?: FindRelationOptions<Relation>,
  ): Promise<(Relation | undefined) | Map<Entity, Relation | undefined>> {
    if (Array.isArray(dto)) {
      return this.batchFindRelations(context, RelationClass, relationName, dto, opts);
    }
    const mapper = MapperFactory.getMapper(RelationClass, this.getRelationEntity(relationName));
    const relationEntity = await this.getRelationQueryBuilder(relationName)
      .select(dto, { filter: opts?.filter, paging: { limit: 1 } })
      .getOne();
    return relationEntity ? mapper.convertToDTO(relationEntity) : undefined;
  }

  /**
   * Add a single relation.
   * @param id - The id of the entity to add the relation to.
   * @param relationName - The name of the relation to query for.
   * @param relationIds - The ids of relations to add.
   * @param opts - Addition options
   */
  async addRelations<Relation>(
    context: IContext,
    relationName: string,
    id: string | number,
    relationIds: (string | number)[],
    opts?: ModifyRelationOptions<Entity, Relation>,
  ): Promise<Entity> {
    const entity = await this.getById(context, id, opts);
    const relations = await this.getRelations(relationName, relationIds, opts?.relationFilter);
    if (!this.foundAllRelations(relationIds, relations)) {
      throw new Error(`Unable to find all ${relationName} to add to ${this.EntityClass.name}`);
    }
    await this.createTypeormRelationQueryBuilder(entity, relationName).add(relationIds);
    return entity;
  }

  /**
   * Set the relations on the entity.
   *
   * @param id - The id of the entity to set the relation on.
   * @param relationName - The name of the relation to query for.
   * @param relationIds - The ids of the relation to set on the entity. If the relationIds is empty all relations
   * will be removed.
   * @param opts - Additional options
   */
  async setRelations<Relation>(
    context: IContext,
    relationName: string,
    id: string | number,
    relationIds: (string | number)[],
    opts?: ModifyRelationOptions<Entity, Relation>,
  ): Promise<Entity> {
    const entity = await this.getById(context, id, opts);
    const relations = await this.getRelations(relationName, relationIds, opts?.relationFilter);
    if (relationIds.length) {
      if (!this.foundAllRelations(relationIds, relations)) {
        throw new Error(`Unable to find all ${relationName} to set on ${this.EntityClass.name}`);
      }
    }
    const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
    const existingRelations = await relationQueryBuilder.select(entity, { filter: opts?.relationFilter }).getMany();
    await this.createTypeormRelationQueryBuilder(entity, relationName).addAndRemove(relations, existingRelations);
    return entity;
  }

  /**
   * Set the relation on the entity.
   *
   * @param id - The id of the entity to set the relation on.
   * @param relationName - The name of the relation to query for.
   * @param relationId - The id of the relation to set on the entity.
   * @param opts - Additional options
   */
  async setRelation<Relation>(
    context: IContext,
    relationName: string,
    id: string | number,
    relationId: string | number,
    opts?: ModifyRelationOptions<Entity, Relation>,
  ): Promise<Entity> {
    const entity = await this.getById(context, id, opts);
    const relation = (await this.getRelations(relationName, [relationId], opts?.relationFilter))[0];
    if (!relation) {
      throw new Error(`Unable to find ${relationName} to set on ${this.EntityClass.name}`);
    }
    await this.createTypeormRelationQueryBuilder(entity, relationName).set(relationId);
    return entity;
  }

  /**
   * 删除多个关系.
   * @param id - The id of the entity to add the relation to.
   * @param relationName - The name of the relation to query for.
   * @param relationIds - The ids of the relations to add.
   * @param opts - Additional options
   */
  async removeRelations<Relation>(
    context: IContext,
    relationName: string,
    id: string | number,
    relationIds: (string | number)[],
    opts?: ModifyRelationOptions<Entity, Relation>,
  ): Promise<Entity> {
    const entity = await this.getById(context, id, opts);
    const relations = await this.getRelations(relationName, relationIds, opts?.relationFilter);
    if (!this.foundAllRelations(relationIds, relations)) {
      throw new Error(`Unable to find all ${relationName} to remove from ${this.EntityClass.name}`);
    }
    await this.createTypeormRelationQueryBuilder(entity, relationName).remove(relationIds);
    return entity;
  }

  /**
   * Remove the relation on the entity.
   *
   * @param id - The id of the entity to set the relation on.
   * @param relationName - The name of the relation to query for.
   * @param relationId - The id of the relation to set on the entity.
   */
  async removeRelation<Relation>(
    context: IContext,
    relationName: string,
    id: string | number,
    relationId: string | number,
    opts?: ModifyRelationOptions<Entity, Relation>,
  ): Promise<Entity> {
    const entity = await this.getById(context, id, opts);
    const relation = (await this.getRelations(relationName, [relationId], opts?.relationFilter))[0];
    if (!relation) {
      throw new Error(`Unable to find ${relationName} to remove from ${this.EntityClass.name}`);
    }
    const meta = this.getRelationMeta(relationName);
    if (meta.isOneToOne || meta.isManyToOne) {
      await this.createTypeormRelationQueryBuilder(entity, relationName).set(null);
    } else {
      await this.createTypeormRelationQueryBuilder(entity, relationName).remove(relationId);
    }

    return entity;
  }

  getRelationQueryBuilder<Relation>(name: string): RelationQueryBuilder<Entity, Relation> {
    return new RelationQueryBuilder(this.repo, name);
  }

  /**
   * Query for an array of relations for multiple dtos.
   * @param RelationClass - The class to serialize the relations into.
   * @param entities - The entities to query relations for.
   * @param relationName - The name of relation to query for.
   * @param query - A query to filter, page or sort relations.
   */
  private async batchQueryRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    entities: Entity[],
    query: Query<Relation>,
  ): Promise<Map<Entity, Relation[]>> {
    const mapper = MapperFactory.getMapper(RelationClass, this.getRelationEntity(relationName));
    const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
    const convertedQuery = mapper.convertQuery(query);
    const entityRelations = await relationQueryBuilder.batchSelect(entities, convertedQuery).getRawAndEntities();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return entityRelations.raw.reduce((results: Map<Entity, Relation[]>, rawRelation: EntityIndexRelation<unknown>) => {
      // eslint-disable-next-line no-underscore-dangle
      const index: number = rawRelation.__nestjsQuery__entityIndex__;
      const e = entities[index];
      const relationDtos = mapper.convertToDTOs(
        this.getRelationsFromPrimaryKeys(relationQueryBuilder, rawRelation, entityRelations.entities),
      );
      return results.set(e, [...(results.get(e) ?? []), ...relationDtos]);
    }, new Map<Entity, Relation[]>());
  }

  /**
   * Query for an array of relations for multiple dtos.
   * @param RelationClass - The class to serialize the relations into.
   * @param entities - The entities to query relations for.
   * @param relationName - The name of relation to query for.
   * @param query - A query to filter, page or sort relations.
   */
  private async batchAggregateRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    entities: Entity[],
    filter: Filter<Relation>,
    aggregate: AggregateQuery<Relation>,
  ): Promise<Map<Entity, AggregateResponse<Relation>[]>> {
    const mapper = MapperFactory.getMapper(RelationClass, this.getRelationEntity(relationName));
    const relationQueryBuilder = this.getRelationQueryBuilder<Relation>(relationName);
    const convertedQuery = mapper.convertQuery({ filter });
    const rawAggregates = await relationQueryBuilder
      .batchAggregate(entities, convertedQuery, aggregate)
      .getRawMany<EntityIndexRelation<Record<string, unknown>>>();
    return rawAggregates.reduce((results, relationAgg) => {
      // eslint-disable-next-line no-underscore-dangle
      const index = relationAgg.__nestjsQuery__entityIndex__;
      const e = entities[index];
      const resultingAgg = results.get(e) ?? [];
      results.set(e, [
        ...resultingAgg,
        ...AggregateBuilder.convertToAggregateResponse([
          omit(relationAgg, relationQueryBuilder.entityIndexColName),
        ]),
      ]);
      return results;
    }, new Map<Entity, AggregateResponse<Relation>[]>());
  }

  /**
   * Count the number of relations for multiple dtos.
   * @param RelationClass - The class to serialize the relations into.
   * @param entities - The entities to query relations for.
   * @param relationName - The name of relation to query for.
   * @param filter - The filter to apply to the relation query.
   */
  private async batchCountRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    entities: Entity[],
    filter: Filter<Relation>,
  ): Promise<Map<Entity, number>> {
    const mapper = MapperFactory.getMapper(RelationClass, this.getRelationEntity(relationName));
    const relationQueryBuilder = this.getRelationQueryBuilder(relationName);
    const convertedQuery = mapper.convertQuery({ filter });
    const entityRelations = await Promise.all(
      entities.map((e) => relationQueryBuilder.select(e, convertedQuery).getCount()),
    );
    return entityRelations.reduce((results, relationCount, index) => {
      const e = entities[index];
      results.set(e, relationCount);
      return results;
    }, new Map<Entity, number>());
  }

  /**
   * Query for a relation for multiple dtos.
   * @param RelationClass - The class to serialize the relations into.
   * @param dtos - The dto to query relations for.
   * @param relationName - The name of relation to query for.
   * @param query - A query to filter, page or sort relations.
   */
  private async batchFindRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dtos: Entity[],
    opts?: FindRelationOptions<Relation>,
  ): Promise<Map<Entity, Relation | undefined>> {
    const batchResults = await this.batchQueryRelations(context, RelationClass, relationName, dtos, {
      paging: { limit: 1 },
      filter: opts?.filter,
    });
    const results = new Map<Entity, Relation>();
    batchResults.forEach((relation, dto) => {
      // get just the first one.
      results.set(dto, relation[0]);
    });
    return results;
  }

  private createTypeormRelationQueryBuilder(entity: Entity, relationName: string): TypeOrmRelationQueryBuilder<Entity> {
    return this.repo.createQueryBuilder().relation(relationName).of(entity);
  }

  private getRelationMeta(relationName: string): RelationMetadata {
    const relationMeta = this.repo.metadata.relations.find((r) => r.propertyName === relationName);
    if (!relationMeta) {
      throw new Error(`Unable to find relation ${relationName} on ${this.EntityClass.name}`);
    }
    return relationMeta;
  }

  private getRelationEntity(relationName: string): Class<unknown> {
    const relationMeta = this.getRelationMeta(relationName);
    if (typeof relationMeta.type === 'string') {
      return this.repo.manager.getRepository(relationMeta.type).target as Class<unknown>;
    }
    return relationMeta.type as Class<unknown>;
  }

  private getRelationsFromPrimaryKeys<Relation>(
    relationBuilder: RelationQueryBuilder<Entity, Relation>,
    rawResult: ObjectLiteral,
    relations: Relation[],
  ): Relation[] {
    const pks = relationBuilder.getRelationPrimaryKeysPropertyNameAndColumnsName();
    const _filter = pks.reduce(
      (keys, key) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ({ ...keys, [key.propertyName]: rawResult[key.columnName] }),
      {} as Partial<Entity>,
    );
    return filter(relations, _filter) as Relation[];
  }

  private getRelations<Relation>(
    relationName: string,
    ids: (string | number)[],
    filter?: Filter<Relation>,
  ): Promise<Relation[]> {
    const relationQueryBuilder = this.getRelationQueryBuilder<Relation>(relationName).filterQueryBuilder;
    return relationQueryBuilder.selectById(ids, { filter }).getMany();
  }

  private foundAllRelations<Relation>(relationIds: (string | number)[], relations: Relation[]): boolean {
    return new Set([...relationIds]).size === relations.length;
  }
}