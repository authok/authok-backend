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
} from '@libs/nest-core';
import {
  Repository,
  DeleteResult,
  DeepPartial as TypeOrmDeepPartial,
  FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { FilterQueryBuilder, AggregateBuilder } from '../query';
import { RelationQueryRepository } from './relation-query.repository';

export interface TypeOrmQueryRepositoryOpts<Entity> {
  useSoftDelete?: boolean;
  filterQueryBuilder?: FilterQueryBuilder<Entity>;
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
export class TypeOrmQueryRepository<Entity>
  extends RelationQueryRepository<Entity>
  implements QueryRepository<Entity, DeepPartial<Entity>, DeepPartial<Entity>>
{
  readonly filterQueryBuilder: FilterQueryBuilder<Entity>;

  readonly useSoftDelete: boolean;

  constructor(
    readonly repo: Repository<Entity>,
    opts?: TypeOrmQueryRepositoryOpts<Entity>,
  ) {
    super();
    this.filterQueryBuilder =
      opts?.filterQueryBuilder ?? new FilterQueryBuilder<Entity>(this.repo);
    this.useSoftDelete = opts?.useSoftDelete ?? false;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  get EntityClass(): Class<Entity> {
    return this.repo.target as Class<Entity>;
  }

  /**
   * Query for multiple entities, using a Query from `@libs/nest-core`.
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
    return this.filterQueryBuilder.select(query).getMany();
  }

  queryOne(
    context: IContext,
    filter: Filter<Entity>,
  ): Promise<Entity | undefined> {
    return this.filterQueryBuilder.select({ filter }).getOne();
  }

  async aggregate(
    context: IContext,
    filter: Filter<Entity>,
    aggregate: AggregateQuery<Entity>,
  ): Promise<AggregateResponse<Entity>[]> {
    return AggregateBuilder.asyncConvertToAggregateResponse(
      this.filterQueryBuilder
        .aggregate({ filter }, aggregate)
        .getRawMany<Record<string, unknown>>(),
    );
  }

  async count(context: IContext, filter: Filter<Entity>): Promise<number> {
    return this.filterQueryBuilder.select({ filter }).getCount();
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
    id: string | number,
    opts?: FindByIdOptions<Entity>,
  ): Promise<Entity | undefined> {
    return this.filterQueryBuilder.selectById(id, opts ?? {}).getOne();
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
    id: string | number,
    opts?: GetByIdOptions<Entity>,
  ): Promise<Entity> {
    const entity = await this.findById(context, id, opts);
    if (!entity) {
      throw new NotFoundException(
        `Unable to find ${this.EntityClass.name} with id: ${id}`,
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
    const entity = (await this.ensureIsEntityAndDoesNotExist(record)) as Entity;
    return this.repo.save(entity as TypeOrmDeepPartial<Entity>);
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
    const entities = await Promise.all(
      records.map((r) => this.ensureIsEntityAndDoesNotExist(r)),
    );
    return this.repo.save(entities as unknown as TypeOrmDeepPartial<Entity>[]);
  }

  /**
   * Update an entity.
   *
   * @example
   * ```ts
   * const updatedEntity = await this.service.updateOne(1, { completed: true });
   * ```
   * @param id - The `id` of the record.
   * @param update - A `Partial` of the entity with fields to update.
   * @param opts - Additional options.
   */
  async updateOne(
    context: IContext,
    id: number | string,
    update: DeepPartial<Entity>,
    opts?: UpdateOneOptions<Entity>,
  ): Promise<Entity> {
    this.ensureIdIsNotPresent(update);
    const entity = await this.getById(context, id, opts);
    return this.repo.save(
      this.repo.merge(
        entity,
        update as TypeOrmDeepPartial<Entity>,
      ) as TypeOrmDeepPartial<Entity>,
    );
  }

  /**
   * Update multiple entities with a `@libs/nest-core` Filter.
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
    this.ensureIdIsNotPresent(update);
    const updateResult = await this.filterQueryBuilder
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
    id: string | number,
    opts?: DeleteOneOptions<Entity>,
  ): Promise<Entity> {
    const entity = await this.getById(context, id, opts);
    if (this.useSoftDelete) {
      return this.repo.softRemove(entity as TypeOrmDeepPartial<Entity>);
    }
    return this.repo.remove(entity as Entity);
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
    let deleteResult: DeleteResult;
    if (this.useSoftDelete) {
      deleteResult = await this.filterQueryBuilder
        .softDelete({ filter })
        .execute();
    } else {
      deleteResult = await this.filterQueryBuilder.delete({ filter }).execute();
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
    this.ensureSoftDeleteEnabled();
    await this.repo.restore(id);
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
    this.ensureSoftDeleteEnabled();
    const result = await this.filterQueryBuilder
      .softDelete({ filter })
      .restore()
      .execute();
    return { updatedCount: result.affected || 0 };
  }

  private async ensureIsEntityAndDoesNotExist(
    e: DeepPartial<Entity>,
  ): Promise<Entity> {
    if (!(e instanceof this.EntityClass)) {
      return this.ensureEntityDoesNotExist(
        this.repo.create(e as TypeOrmDeepPartial<Entity>) as Entity,
      );
    }
    return this.ensureEntityDoesNotExist(e);
  }

  private async ensureEntityDoesNotExist(e: Entity): Promise<Entity> {
    if (this.repo.hasId(e)) {
      const found = await this.repo.findOneBy({
          id: this.repo.getId(e) as string | number,
      } as unknown as FindOptionsWhere<Entity>);
      if (found) {
        throw new Error('Entity already exists');
      }
    }
    return e;
  }

  private ensureIdIsNotPresent(e: DeepPartial<Entity>): void {
    if (this.repo.hasId(e as unknown as Entity)) {
      throw new Error('Id cannot be specified when updating');
    }
  }

  private ensureSoftDeleteEnabled(): void {
    if (!this.useSoftDelete) {
      throw new MethodNotAllowedException(
        `Restore not allowed for non soft deleted entity ${this.EntityClass.name}.`,
      );
    }
  }
}
