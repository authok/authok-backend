import { Mapper } from '../mappers';
import { Class, DeepPartial } from '../common';
import {
  AggregateQuery,
  AggregateResponse,
  DeleteManyResponse,
  DeleteOneOptions,
  Filter,
  Filterable,
  FindByIdOptions,
  FindRelationOptions,
  GetByIdOptions,
  ModifyRelationOptions,
  Query,
  UpdateManyResponse,
  UpdateOneOptions,
  IContext,
} from '../interfaces';
import { QueryRepository } from './query.repository';

export class MapperQueryRepository<
  DTO,
  Entity,
  C = DeepPartial<DTO>,
  CE = DeepPartial<Entity>,
  U = C,
  UE = CE,
> implements QueryRepository<DTO, C, U>
{
  constructor(
    readonly mapper: Mapper<DTO, Entity, C, CE, U, UE>,
    readonly queryRepository: QueryRepository<Entity, CE, UE>,
  ) {}

  addRelations<Relation>(
    context: IContext,
    relationName: string,
    id: string | number,
    relationIds: (string | number | object)[],
    opts?: ModifyRelationOptions<DTO, Relation>,
  ): Promise<DTO> {
    return this.mapper.convertAsyncToDTO(
      this.queryRepository.addRelations(
        context,
        relationName,
        id,
        relationIds,
        this.convertModifyRelationsOptions(opts),
      ),
    );
  }

  createMany(context: IContext, items: C[]): Promise<DTO[]> {
    const { mapper } = this;
    const converted = mapper.convertToCreateEntities(items);
    return this.mapper.convertAsyncToDTOs(
      this.queryRepository.createMany(context, converted),
    );
  }

  createOne(context: IContext, item: C): Promise<DTO> {
    const c = this.mapper.convertToCreateEntity(item);
    return this.mapper.convertAsyncToDTO(
      this.queryRepository.createOne(context, c),
    );
  }

  async deleteMany(
    context: IContext,
    filter: Filter<DTO>,
  ): Promise<DeleteManyResponse> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.queryRepository.deleteMany(
      context,
      this.mapper.convertQuery({ filter }).filter!,
    );
  }

  deleteOne(
    context: IContext,
    id: number | string,
    opts?: DeleteOneOptions<DTO>,
  ): Promise<DTO> {
    return this.mapper.convertAsyncToDTO(
      this.queryRepository.deleteOne(context, id, this.convertFilterable(opts)),
    );
  }

  async findById(
    context: IContext,
    id: string | number,
    opts?: FindByIdOptions<DTO>,
  ): Promise<DTO | undefined> {
    const entity = await this.queryRepository.findById(
      context,
      id,
      this.convertFilterable(opts),
    );
    if (!entity) {
      return undefined;
    }
    return this.mapper.convertToDTO(entity);
  }

  getById(
    context: IContext,
    id: string | number,
    opts?: GetByIdOptions<DTO>,
  ): Promise<DTO> {
    return this.mapper.convertAsyncToDTO(
      this.queryRepository.getById(context, id, this.convertFilterable(opts)),
    );
  }

  query(context: IContext, query: Query<DTO>): Promise<DTO[]> {
    return this.mapper.convertAsyncToDTOs(
      this.queryRepository.query(context, this.mapper.convertQuery(query)),
    );
  }

  async queryOne(
    context: IContext,
    filter: Filter<DTO>,
  ): Promise<DTO | undefined> {
    const entity = await this.queryRepository.queryOne(
      context,
      this.mapper.convertQuery({ filter }).filter || {},
    );
    if (!entity) {
      return undefined;
    }
    return this.mapper.convertToDTO(entity);
  }

  async aggregate(
    context: IContext,
    filter: Filter<DTO>,
    aggregate: AggregateQuery<DTO>,
  ): Promise<AggregateResponse<DTO>[]> {
    const aggregateResponse = await this.queryRepository.aggregate(
      context,
      this.mapper.convertQuery({ filter }).filter || {},
      this.mapper.convertAggregateQuery(aggregate),
    );
    return aggregateResponse.map((agg) =>
      this.mapper.convertAggregateResponse(agg),
    );
  }

  count(context: IContext, filter: Filter<DTO>): Promise<number> {
    return this.queryRepository.count(
      context,
      this.mapper.convertQuery({ filter }).filter || {},
    );
  }

  /**
   * Query for relations for an array of DTOs. This method will return a map with the DTO as the key and the relations as the value.
   * @param RelationClass - The class of the relation.
   * @param relationName - The name of the relation to load.
   * @param dtos - the dtos to find relations for.
   * @param query - A query to use to filter, page, and sort relations.
   */
  queryRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dtos: DTO[],
    query: Query<Relation>,
  ): Promise<Map<DTO, Relation[]>>;

  /**
   * Query for an array of relations.
   * @param RelationClass - The class to serialize the relations into.
   * @param dto - The dto to query relations for.
   * @param relationName - The name of relation to query for.
   * @param query - A query to filter, page and sort relations.
   */
  queryRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: DTO,
    query: Query<Relation>,
  ): Promise<Relation[]>;

  async queryRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: DTO | DTO[],
    query: Query<Relation>,
  ): Promise<Relation[] | Map<DTO, Relation[]>> {
    if (Array.isArray(dto)) {
      const entities = this.mapper.convertToEntities(dto);
      const relationMap = await this.queryRepository.queryRelations(
        context,
        RelationClass,
        relationName,
        entities,
        query,
      );
      return entities.reduce((map, e, index) => {
        const entry = relationMap.get(e) ?? [];
        map.set(dto[index], entry);
        return map;
      }, new Map<DTO, Relation[]>());
    }
    return this.queryRepository.queryRelations(
      context,
      RelationClass,
      relationName,
      this.mapper.convertToEntity(dto),
      query,
    );
  }

  countRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: DTO,
    filter: Filter<Relation>,
  ): Promise<number>;

  countRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: DTO[],
    filter: Filter<Relation>,
  ): Promise<Map<DTO, number>>;

  async countRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: DTO | DTO[],
    filter: Filter<Relation>,
  ): Promise<number | Map<DTO, number>> {
    if (Array.isArray(dto)) {
      const entities = this.mapper.convertToEntities(dto);
      const relationMap = await this.queryRepository.countRelations(
        context,
        RelationClass,
        relationName,
        entities,
        filter,
      );
      return entities.reduce((map, e, index) => {
        const entry = relationMap.get(e) ?? 0;
        map.set(dto[index], entry);
        return map;
      }, new Map<DTO, number>());
    }
    return this.queryRepository.countRelations(
      context,
      RelationClass,
      relationName,
      this.mapper.convertToEntity(dto),
      filter,
    );
  }
  /**
   * Find a relation for an array of DTOs. This will return a Map where the key is the DTO and the value is to relation or undefined if not found.
   * @param RelationClass - the class of the relation
   * @param relationName - the name of the relation to load.
   * @param dtos - the dtos to find the relation for.
   * @param filter - Additional filter to apply when finding relations
   */
  async findRelation<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dtos: DTO[],
    opts?: FindRelationOptions<Relation>,
  ): Promise<Map<DTO, Relation | undefined>>;

  /**
   * Finds a single relation.
   * @param RelationClass - The class to serialize the relation into.
   * @param dto - The dto to find the relation for.
   * @param relationName - The name of the relation to query for.
   * @param filter - Additional filter to apply when finding relations
   */
  async findRelation<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: DTO,
    opts?: FindRelationOptions<Relation>,
  ): Promise<Relation | undefined>;

  async findRelation<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: DTO | DTO[],
    opts?: FindRelationOptions<Relation>,
  ): Promise<(Relation | undefined) | Map<DTO, Relation | undefined>> {
    if (Array.isArray(dto)) {
      const entities = this.mapper.convertToEntities(dto);
      const relationMap = await this.queryRepository.findRelation(
        context,
        RelationClass,
        relationName,
        entities,
        opts,
      );
      return entities.reduce((map, e, index) => {
        map.set(dto[index], relationMap.get(e));
        return map;
      }, new Map<DTO, Relation | undefined>());
    }
    return this.queryRepository.findRelation(
      context,
      RelationClass,
      relationName,
      this.mapper.convertToEntity(dto),
    );
  }

  removeRelation<Relation>(
    context: IContext,
    relationName: string,
    id: string | number,
    relationId: string | number,
    opts?: ModifyRelationOptions<DTO, Relation>,
  ): Promise<DTO> {
    return this.mapper.convertAsyncToDTO(
      this.queryRepository.removeRelation(
        context,
        relationName,
        id,
        relationId,
        this.convertModifyRelationsOptions(opts),
      ),
    );
  }

  removeRelations<Relation>(
    context: IContext,
    relationName: string,
    id: string | number | object,
    relationIds: (string | number | object)[],
    opts?: ModifyRelationOptions<DTO, Relation>,
  ): Promise<DTO> {
    return this.mapper.convertAsyncToDTO(
      this.queryRepository.removeRelations(
        context,
        relationName,
        id,
        relationIds,
        this.convertModifyRelationsOptions(opts),
      ),
    );
  }

  setRelations<Relation>(
    context: IContext,
    relationName: string,
    id: string | number | object,
    relationIds: (string | number | object)[],
    opts?: ModifyRelationOptions<DTO, Relation>,
  ): Promise<DTO> {
    return this.mapper.convertAsyncToDTO(
      this.queryRepository.setRelations(
        context,
        relationName,
        id,
        relationIds,
        this.convertModifyRelationsOptions(opts),
      ),
    );
  }

  setRelation<Relation>(
    context: IContext,
    relationName: string,
    id: string | number | object,
    relationId: string | number,
    opts?: ModifyRelationOptions<DTO, Relation>,
  ): Promise<DTO> {
    return this.mapper.convertAsyncToDTO(
      this.queryRepository.setRelation(
        context,
        relationName,
        id,
        relationId,
        this.convertModifyRelationsOptions(opts),
      ),
    );
  }

  updateMany(
    context: IContext,
    update: U,
    filter: Filter<DTO>,
  ): Promise<UpdateManyResponse> {
    return this.queryRepository.updateMany(
      context,
      this.mapper.convertToUpdateEntity(update),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.mapper.convertQuery({ filter }).filter!,
    );
  }

  updateOne(
    context: IContext,
    id: string | number,
    update: U,
    opts?: UpdateOneOptions<DTO>,
  ): Promise<DTO> {
    return this.mapper.convertAsyncToDTO(
      this.queryRepository.updateOne(
        context,
        id,
        this.mapper.convertToUpdateEntity(update),
        this.convertFilterable(opts),
      ),
    );
  }

  aggregateRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: DTO,
    filter: Filter<Relation>,
    aggregate: AggregateQuery<Relation>,
  ): Promise<AggregateResponse<Relation>[]>;

  aggregateRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dtos: DTO[],
    filter: Filter<Relation>,
    aggregate: AggregateQuery<Relation>,
  ): Promise<Map<DTO, AggregateResponse<Relation>[]>>;

  async aggregateRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: DTO | DTO[],
    filter: Filter<Relation>,
    aggregate: AggregateQuery<Relation>,
  ): Promise<
    AggregateResponse<Relation>[] | Map<DTO, AggregateResponse<Relation>[]>
  > {
    if (Array.isArray(dto)) {
      const entities = this.mapper.convertToEntities(dto);
      const relationMap = await this.queryRepository.aggregateRelations(
        context,
        RelationClass,
        relationName,
        entities,
        filter,
        aggregate,
      );
      return entities.reduce((map, e, index) => {
        const entry = relationMap.get(e) ?? [];
        map.set(dto[index], entry);
        return map;
      }, new Map<DTO, AggregateResponse<Relation>[]>());
    }
    return this.queryRepository.aggregateRelations(
      context,
      RelationClass,
      relationName,
      this.mapper.convertToEntity(dto),
      filter,
      aggregate,
    );
  }

  private convertFilterable(
    filterable?: Filterable<DTO>,
  ): Filterable<Entity> | undefined {
    if (!filterable) {
      return undefined;
    }
    return {
      ...filterable,
      filter: this.mapper.convertQuery({ filter: filterable?.filter }).filter,
    };
  }

  private convertModifyRelationsOptions<Relation>(
    modifyRelationOptions?: ModifyRelationOptions<DTO, Relation>,
  ): ModifyRelationOptions<Entity, Relation> | undefined {
    if (!modifyRelationOptions) {
      return undefined;
    }
    return {
      filter: this.mapper.convertQuery({
        filter: modifyRelationOptions?.filter,
      }).filter,
      relationFilter: modifyRelationOptions.relationFilter,
    };
  }
}
