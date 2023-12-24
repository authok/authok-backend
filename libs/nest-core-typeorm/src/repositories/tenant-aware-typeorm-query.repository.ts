import {
  Query,
  DeleteManyResponse,
  UpdateManyResponse,
  DeepPartial,
  Class,
  QueryRepository,
  Filter,
  AggregateQuery,
  AggregateResponse,
  FindByIdOptions,
  GetByIdOptions,
  UpdateOneOptions,
  DeleteOneOptions,
  Filterable,
  IContext,
  MapperFactory,
  FindRelationOptions,
  ModifyRelationOptions,
} from '@libs/nest-core';
import {
  Repository,
  DeleteResult,
  Connection,
  ObjectLiteral,
  RelationQueryBuilder as TypeOrmRelationQueryBuilder,
  DeepPartial as TypeOrmDeepPartial,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import {
  FilterQueryBuilder,
  AggregateBuilder,
  EntityIndexRelation,
  RelationQueryBuilder,
} from '../query';
import { IConnectionManager } from '@libs/nest-core/connection/connection.manager';
import { omit, filter } from 'lodash';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';

export interface TenantAwareTypeOrmQueryRepositoryOpts {
  useSoftDelete?: boolean;
}

/**
 * Base class for all query services that use a `typeorm` Repository.
 *
 * @example
 *
 * ```ts
 * @QueryService(TodoItemEntity)
 * export class TodoItemRepository extends TypeOrmQueryRepository<TodoItemEntity> {
 *   constructor(
 *      @InjectRepository(TodoItemEntity) repo: Repository<TodoItemEntity>,
 *   ) {
 *     super(repo);
 *   }
 * }
 * ```
 */
export class TenantAwareTypeOrmQueryRepository<Entity>
  implements QueryRepository<Entity, DeepPartial<Entity>, DeepPartial<Entity>>
{
  readonly useSoftDelete: boolean;

  constructor(
    readonly entityClass: Class<Entity>,
    readonly connectionManager: IConnectionManager,
    opts?: TenantAwareTypeOrmQueryRepositoryOpts,
  ) {
    this.useSoftDelete = opts?.useSoftDelete ?? false;
  }

  /**
   * 查找多个实体
   *
   * @example
   * ```ts
   * const todoItems = await this.service.query({
   *   filter: { title: { eq: 'Foo' } },
   *   paging: { limit: 10 },
   *   sorting: [{ field: "create", direction: SortDirection.DESC }],
   * });
   * ```
   * @param query - The Query used to filter, page, and sort rows.
   */
  async query(context: IContext, query: Query<Entity>): Promise<Entity[]> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);
    const filterQueryBuilder = new FilterQueryBuilder<Entity>(repo);

    if (context.tenant && repo.metadata.hasColumnWithPropertyPath('tenant')) {
      query.filter.and = query.filter.and || [];
      query.filter.and.push({
        tenant: {
          eq: context.tenant,
        },
      } as any);
    }

    return filterQueryBuilder.select(query).getMany();
  }

  async queryOne(
    context: IContext,
    filter: Filter<Entity>,
  ): Promise<Entity | undefined> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);
    const filterQueryBuilder = new FilterQueryBuilder<Entity>(repo);

    if (context.tenant && repo.metadata.hasColumnWithPropertyPath('tenant')) {
      filter.and = filter.and || [];
      filter.and.push({
        tenant: {
          eq: context.tenant,
        },
      } as any);
    }

    return filterQueryBuilder.select({ filter }).getOne();
  }

  async aggregate(
    context: IContext,
    filter: Filter<Entity>,
    aggregate: AggregateQuery<Entity>,
  ): Promise<AggregateResponse<Entity>[]> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);
    const filterQueryBuilder = new FilterQueryBuilder<Entity>(repo);

    return AggregateBuilder.asyncConvertToAggregateResponse(
      filterQueryBuilder
        .aggregate({ filter }, aggregate)
        .getRawMany<Record<string, unknown>>(),
    );
  }

  async count(context: IContext, filter: Filter<Entity>): Promise<number> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);
    const filterQueryBuilder = new FilterQueryBuilder<Entity>(repo);

    if (context.tenant && repo.metadata.hasColumnWithPropertyPath('tenant')) {
      filter.and = filter.and || [];
      filter.and.push({
        tenant: {
          eq: context.tenant,
        },
      } as any);
    }

    return filterQueryBuilder.select({ filter }).getCount();
  }

  /**
   * Find an entity by it's `id`.
   *
   * @example
   * ```ts
   * const todoItem = await this.service.findById(1);
   * ```
   * @param id - The id of the record to find.
   */
  async findById(
    context: IContext,
    id: string | number | object,
    opts?: FindByIdOptions<Entity>,
  ): Promise<Entity | undefined> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);
    const filterQueryBuilder = new FilterQueryBuilder<Entity>(repo);

    return filterQueryBuilder.selectById(id, opts ?? {}).getOne();
  }

  /**
   * Gets an entity by it's `id`. If the entity is not found a rejected promise is returned.
   *
   * @example
   * ```ts
   * try {
   *   const todoItem = await this.service.getById(1);
   * } catch(e) {
   *   console.error('Unable to find entity with id = 1');
   * }
   * ```
   * @param id - The id of the record to find.
   */
  async getById(
    context: IContext,
    id: string | number | object,
    opts?: GetByIdOptions<Entity>,
  ): Promise<Entity> {
    const entity = await this.findById(context, id, opts);
    if (!entity) {
      throw new NotFoundException(
        `Unable to find ${this.entityClass.name} with id: ${id}`,
      );
    }
    return entity;
  }

  /**
   * Creates a single entity.
   *
   * @example
   * ```ts
   * const todoItem = await this.service.createOne({title: 'Todo Item', completed: false });
   * ```
   * @param record - The entity to create.
   */
  async createOne(
    context: IContext,
    record: DeepPartial<Entity>,
  ): Promise<Entity> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const entity = await this.ensureIsEntityAndDoesNotExist(repo, record);
    if (context.tenant && repo.metadata.hasColumnWithPropertyPath('tenant')) {
      entity['tenant'] = context.tenant;
    }

    return repo.save(entity as TypeOrmDeepPartial<Entity>);
  }

  /**
   * Create multiple entities.
   *
   * @example
   * ```ts
   * const todoItem = await this.service.createMany([
   *   {title: 'Todo Item 1', completed: false },
   *   {title: 'Todo Item 2', completed: true },
   * ]);
   * ```
   * @param records - The entities to create.
   */
  async createMany(
    context: IContext,
    records: DeepPartial<Entity>[],
  ): Promise<Entity[]> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const entities = await Promise.all(
      records.map((r) => this.ensureIsEntityAndDoesNotExist(repo, r)),
    );
    return repo.save(entities as TypeOrmDeepPartial<Entity>[]);
  }

  /**
   * 更新一个实体.
   *
   * @example
   * ```ts
   * const updatedEntity = await this.service.updateOne(1, { completed: true });
   * ```
   * @param id - 记录的 `id`.
   * @param update - A `Partial` of the entity with fields to update.
   * @param opts - 额外选项.
   */
  async updateOne(
    context: IContext,
    id: number | string | object,
    update: DeepPartial<Entity>,
    opts?: UpdateOneOptions<Entity>,
  ): Promise<Entity> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    this.ensureIdIsNotPresent(repo, update);
    const entity = await this.getById(context, id, opts);
    return repo.save(
      repo.merge(
        entity,
        update as TypeOrmDeepPartial<Entity>,
      ) as TypeOrmDeepPartial<Entity>,
    );
  }

  /**
   * 用 `@libs/nest-core` Filter 更新多个实体
   *
   * @example
   * ```ts
   * const { updatedCount } = await this.service.updateMany(
   *   { completed: true }, // the update to apply
   *   { title: { eq: 'Foo Title' } } // Filter to find records to update
   * );
   * ```
   * @param update - A `Partial` of entity with the fields to update
   * @param filter - A Filter used to find the records to update
   */
  async updateMany(
    context: IContext,
    update: DeepPartial<Entity>,
    filter: Filter<Entity>,
  ): Promise<UpdateManyResponse> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);
    const filterQueryBuilder = new FilterQueryBuilder<Entity>(repo);

    this.ensureIdIsNotPresent(repo, update);

    const updateResult = await filterQueryBuilder
      .update({ filter })
      .set({ ...(update as QueryDeepPartialEntity<Entity>) })
      .execute();
    return { updatedCount: updateResult.affected || 0 };
  }

  /**
   * Delete an entity by `id`.
   *
   * @example
   *
   * ```ts
   * const deletedTodo = await this.service.deleteOne(1);
   * ```
   *
   * @param id - The `id` of the entity to delete.
   * @param filter Additional filter to use when finding the entity to delete.
   */
  async deleteOne(
    context: IContext,
    id: string | number | object,
    opts?: DeleteOneOptions<Entity>,
  ): Promise<Entity> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const entity = await this.getById(context, id, opts);
    if (this.useSoftDelete) {
      return repo.softRemove(entity as TypeOrmDeepPartial<Entity>);
    }
    return repo.remove(entity);
  }

  /**
   * Delete multiple records with a `@libs/nest-core` `Filter`.
   *
   * @example
   *
   * ```ts
   * const { deletedCount } = this.service.deleteMany({
   *   created: { lte: new Date('2020-1-1') }
   * });
   * ```
   *
   * @param filter - A `Filter` to find records to delete.
   */
  async deleteMany(
    context: IContext,
    filter: Filter<Entity>,
  ): Promise<DeleteManyResponse> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);
    const filterQueryBuilder = new FilterQueryBuilder<Entity>(repo);

    let deleteResult: DeleteResult;
    if (this.useSoftDelete) {
      deleteResult = await filterQueryBuilder.softDelete({ filter }).execute();
    } else {
      deleteResult = await filterQueryBuilder.delete({ filter }).execute();
    }
    return { deletedCount: deleteResult.affected || 0 };
  }

  /**
   * Restore an entity by `id`.
   *
   * @example
   *
   * ```ts
   * const restoredTodo = await this.service.restoreOne(1);
   * ```
   *
   * @param id - The `id` of the entity to restore.
   * @param opts Additional filter to use when finding the entity to restore.
   */
  async restoreOne(
    context: IContext,
    id: string | number,
    opts?: Filterable<Entity>,
  ): Promise<Entity> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    this.ensureSoftDeleteEnabled();
    await repo.restore(id);
    return this.getById(context, id, opts);
  }

  /**
   * Restores multiple records with a `@libs/nest-core` `Filter`.
   *
   * @example
   *
   * ```ts
   * const { updatedCount } = this.service.restoreMany({
   *   created: { lte: new Date('2020-1-1') }
   * });
   * ```
   *
   * @param filter - A `Filter` to find records to delete.
   */
  async restoreMany(
    context: IContext,
    filter: Filter<Entity>,
  ): Promise<UpdateManyResponse> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);
    const filterQueryBuilder = new FilterQueryBuilder<Entity>(repo);

    this.ensureSoftDeleteEnabled();
    const result = await filterQueryBuilder
      .softDelete({ filter })
      .restore()
      .execute();
    return { updatedCount: result.affected || 0 };
  }

  private async ensureIsEntityAndDoesNotExist(
    repo: Repository<Entity>,
    e: DeepPartial<Entity>,
  ): Promise<Entity> {
    if (!(e instanceof this.entityClass)) {
      return this.ensureEntityDoesNotExist(
        repo,
        repo.create(e as TypeOrmDeepPartial<Entity>),
      );
    }
    return this.ensureEntityDoesNotExist(repo, e);
  }

  private async ensureEntityDoesNotExist(
    repo: Repository<Entity>,
    e: Entity,
  ): Promise<Entity> {
    if (repo.hasId(e)) {
      const found = await repo.findOne(repo.getId(e) as string | number);
      if (found) {
        throw new Error('Entity already exists');
      }
    }
    return e;
  }

  private ensureIdIsNotPresent(
    repo: Repository<Entity>,
    e: DeepPartial<Entity>,
  ): void {
    if (repo.hasId(e as unknown as Entity)) {
      throw new Error('Id cannot be specified when updating');
    }
  }

  private ensureSoftDeleteEnabled(): void {
    if (!this.useSoftDelete) {
      throw new MethodNotAllowedException(
        `Restore not allowed for non soft deleted entity ${this.entityClass.name}.`,
      );
    }
  }

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
      return this.batchQueryRelations(
        context,
        RelationClass,
        relationName,
        dto,
        query,
      );
    }

    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const mapper = MapperFactory.getMapper(
      RelationClass,
      this.getRelationEntity(repo, relationName),
    );
    const relationQueryBuilder = this.getRelationQueryBuilder(
      repo,
      relationName,
    );
    return mapper.convertAsyncToDTOs(
      relationQueryBuilder.select(dto, mapper.convertQuery(query)).getMany(),
    );
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
  ): Promise<
    AggregateResponse<Relation>[] | Map<Entity, AggregateResponse<Relation>[]>
  > {
    if (Array.isArray(dto)) {
      return this.batchAggregateRelations(
        context,
        RelationClass,
        relationName,
        dto,
        filter,
        aggregate,
      );
    }

    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const mapper = MapperFactory.getMapper(
      RelationClass,
      this.getRelationEntity(repo, relationName),
    );
    const relationQueryBuilder = this.getRelationQueryBuilder(
      repo,
      relationName,
    );
    const aggResponse = await AggregateBuilder.asyncConvertToAggregateResponse(
      relationQueryBuilder
        .aggregate(
          dto,
          mapper.convertQuery({ filter }),
          mapper.convertAggregateQuery(aggregate),
        )
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
      return this.batchCountRelations(
        context,
        RelationClass,
        relationName,
        dto,
        filter,
      );
    }

    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const mapper = MapperFactory.getMapper(
      RelationClass,
      this.getRelationEntity(repo, relationName),
    );
    const relationQueryBuilder = this.getRelationQueryBuilder(
      repo,
      relationName,
    );
    return relationQueryBuilder
      .select(dto, mapper.convertQuery({ filter }))
      .getCount();
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
      return this.batchFindRelations(
        context,
        RelationClass,
        relationName,
        dto,
        opts,
      );
    }

    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const mapper = MapperFactory.getMapper(
      RelationClass,
      this.getRelationEntity(repo, relationName),
    );
    const relationEntity = await this.getRelationQueryBuilder(
      repo,
      relationName,
    )
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
    id: string | number | object,
    relationIds: (string | number | object)[],
    opts?: ModifyRelationOptions<Entity, Relation>,
  ): Promise<Entity> {
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const entity = await this.getById(context, id, opts);
    const relations = await this.getRelations(
      repo,
      relationName,
      relationIds,
      opts?.relationFilter,
    );

    if (!this.foundAllRelations(relationIds, relations)) {
      throw new Error(
        `Unable to find all ${relationName} to add to ${this.entityClass.name}`,
      );
    }
    await this.createTypeormRelationQueryBuilder(
      repo,
      entity,
      relationName,
    ).add(relationIds);
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
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const entity = await this.getById(context, id, opts);
    const relations = await this.getRelations(
      repo,
      relationName,
      relationIds,
      opts?.relationFilter,
    );
    if (relationIds.length) {
      if (!this.foundAllRelations(relationIds, relations)) {
        throw new Error(
          `Unable to find all ${relationName} to set on ${this.entityClass.name}`,
        );
      }
    }
    const relationQueryBuilder = this.getRelationQueryBuilder(
      repo,
      relationName,
    );
    const existingRelations = await relationQueryBuilder
      .select(entity, { filter: opts?.relationFilter })
      .getMany();
    await this.createTypeormRelationQueryBuilder(
      repo,
      entity,
      relationName,
    ).addAndRemove(relations, existingRelations);
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
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const entity = await this.getById(context, id, opts);
    const relation = (
      await this.getRelations(
        repo,
        relationName,
        [relationId],
        opts?.relationFilter,
      )
    )[0];
    if (!relation) {
      throw new Error(
        `Unable to find ${relationName} to set on ${this.entityClass.name}`,
      );
    }
    await this.createTypeormRelationQueryBuilder(
      repo,
      entity,
      relationName,
    ).set(relationId);
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
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const entity = await this.getById(context, id, opts);
    const relations = await this.getRelations(
      repo,
      relationName,
      relationIds,
      opts?.relationFilter,
    );
    if (!this.foundAllRelations(relationIds, relations)) {
      throw new Error(
        `Unable to find all ${relationName} to remove from ${this.entityClass.name}`,
      );
    }
    await this.createTypeormRelationQueryBuilder(
      repo,
      entity,
      relationName,
    ).remove(relationIds);

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
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const entity = await this.getById(context, id, opts);
    const relation = (
      await this.getRelations(
        repo,
        relationName,
        [relationId],
        opts?.relationFilter,
      )
    )[0];
    if (!relation) {
      throw new Error(
        `Unable to find ${relationName} to remove from ${this.entityClass.name}`,
      );
    }
    const meta = this.getRelationMeta(repo, relationName);
    if (meta.isOneToOne || meta.isManyToOne) {
      await this.createTypeormRelationQueryBuilder(
        repo,
        entity,
        relationName,
      ).set(null);
    } else {
      await this.createTypeormRelationQueryBuilder(
        repo,
        entity,
        relationName,
      ).remove(relationId);
    }

    return entity;
  }

  getRelationQueryBuilder<Relation>(
    repo: Repository<Entity>,
    name: string,
  ): RelationQueryBuilder<Entity, Relation> {
    return new RelationQueryBuilder(repo, name);
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
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const mapper = MapperFactory.getMapper(
      RelationClass,
      this.getRelationEntity(repo, relationName),
    );
    const relationQueryBuilder = this.getRelationQueryBuilder(
      repo,
      relationName,
    );
    const convertedQuery = mapper.convertQuery(query);
    const entityRelations = await relationQueryBuilder
      .batchSelect(entities, convertedQuery)
      .getRawAndEntities();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return entityRelations.raw.reduce(
      (
        results: Map<Entity, Relation[]>,
        rawRelation: EntityIndexRelation<unknown>,
      ) => {
        // eslint-disable-next-line no-underscore-dangle
        const index: number = rawRelation.__nestjsQuery__entityIndex__;
        const e = entities[index];
        const relationDtos = mapper.convertToDTOs(
          this.getRelationsFromPrimaryKeys(
            relationQueryBuilder,
            rawRelation,
            entityRelations.entities,
          ),
        );
        return results.set(e, [...(results.get(e) ?? []), ...relationDtos]);
      },
      new Map<Entity, Relation[]>(),
    );
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
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const mapper = MapperFactory.getMapper(
      RelationClass,
      this.getRelationEntity(repo, relationName),
    );
    const relationQueryBuilder = this.getRelationQueryBuilder<Relation>(
      repo,
      relationName,
    );
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
    const connection = (await this.connectionManager.get(
      context,
    )) as Connection;
    const repo = connection.getRepository(this.entityClass);

    const mapper = MapperFactory.getMapper(
      RelationClass,
      this.getRelationEntity(repo, relationName),
    );
    const relationQueryBuilder = this.getRelationQueryBuilder(
      repo,
      relationName,
    );
    const convertedQuery = mapper.convertQuery({ filter });
    const entityRelations = await Promise.all(
      entities.map((e) =>
        relationQueryBuilder.select(e, convertedQuery).getCount(),
      ),
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
    const batchResults = await this.batchQueryRelations(
      context,
      RelationClass,
      relationName,
      dtos,
      {
        paging: { limit: 1 },
        filter: opts?.filter,
      },
    );
    const results = new Map<Entity, Relation>();
    batchResults.forEach((relation, dto) => {
      // get just the first one.
      results.set(dto, relation[0]);
    });
    return results;
  }

  private createTypeormRelationQueryBuilder(
    repo: Repository<Entity>,
    entity: Entity,
    relationName: string,
  ): TypeOrmRelationQueryBuilder<Entity> {
    return repo.createQueryBuilder().relation(relationName).of(entity);
  }

  private getRelationMeta(
    repo: Repository<Entity>,
    relationName: string,
  ): RelationMetadata {
    const relationMeta = repo.metadata.relations.find(
      (r) => r.propertyName === relationName,
    );
    if (!relationMeta) {
      throw new Error(
        `Unable to find relation ${relationName} on ${this.entityClass.name}`,
      );
    }
    return relationMeta;
  }

  private getRelationEntity(
    repo: Repository<Entity>,
    relationName: string,
  ): Class<unknown> {
    const relationMeta = this.getRelationMeta(repo, relationName);
    if (typeof relationMeta.type === 'string') {
      return repo.manager.getRepository(relationMeta.type)
        .target as Class<unknown>;
    }
    return relationMeta.type as Class<unknown>;
  }

  private getRelationsFromPrimaryKeys<Relation>(
    relationBuilder: RelationQueryBuilder<Entity, Relation>,
    rawResult: ObjectLiteral,
    relations: Relation[],
  ): Relation[] {
    const pks =
      relationBuilder.getRelationPrimaryKeysPropertyNameAndColumnsName();
    const _filter = pks.reduce(
      (keys, key) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ({ ...keys, [key.propertyName]: rawResult[key.columnName] }),
      {} as Partial<Entity>,
    );
    return filter(relations, _filter) as Relation[];
  }

  private getRelations<Relation>(
    repo: Repository<Entity>,
    relationName: string,
    ids: (string | number | object)[],
    filter?: Filter<Relation>,
  ): Promise<Relation[]> {
    const relationQueryBuilder = this.getRelationQueryBuilder<Relation>(
      repo,
      relationName,
    ).filterQueryBuilder;
    return relationQueryBuilder.selectById(ids, { filter }).getMany();
  }

  private foundAllRelations<Relation>(
    relationIds: (string | number | object)[],
    relations: Relation[],
  ): boolean {
    return new Set([...relationIds]).size === relations.length;
  }
}
