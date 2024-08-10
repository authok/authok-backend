import { Injectable } from '@nestjs/common';
import { DeepPartial, Class } from '../common';
import {
  IContext,
  AggregateQuery,
  AggregateResponse,
  DeleteManyResponse,
  Filter,
  ModifyRelationOptions,
  Query,
  UpdateManyResponse,
  FindRelationOptions,
  FindByIdOptions,
  GetByIdOptions,
  UpdateOneOptions,
  DeleteOneOptions,
} from '../interfaces';

/**
 * Base interface for all QueryRepositories.
 *
 * @typeparam T - The record type that the query repository will operate on.
 */
export interface QueryRepository<DTO, C = DeepPartial<DTO>, U = DeepPartial<DTO>> {
  /**
   * 查找多条记录 `T`.
   * @param query - the query used to filter, page or sort records.
   * @returns a promise with an array of records that match the query.
   */
  query(context: IContext, query: Query<DTO>): Promise<DTO[]>;

  /**
   * 查找单条记录 `T`.
   * @param query - the query used to filter, page or sort records.
   * @returns 
   */
  queryOne(context: IContext, filter: Filter<DTO>): Promise<DTO | undefined>;

  /**
   * 执行一个聚合查询
   * @param filter
   * @param aggregate
   */
  aggregate(context: IContext, filter: Filter<DTO>, aggregate: AggregateQuery<DTO>): Promise<AggregateResponse<DTO>[]>;

  /**
   * 计算筛选的记录总数.
   * @param filter - the filter
   * @returns a promise with the total number of records.
   */
  count(context: IContext, filter: Filter<DTO>): Promise<number>;

  /**
   * 根据 `id` 查找记录.
   * @param id - the id of the record to find.
   * @param opts - Additional options to apply when finding by id.
   * @returns the found record or undefined.
   */
  findById(context: IContext, id: string | number, opts?: FindByIdOptions<DTO>): Promise<DTO | undefined>;

  /**
   * 查找关系列表.
   * @param RelationClass - The class to serialize the Relations into
   * @param dto - The dto to query relations for.
   * @param relationName - The name of relation to query for.
   * @param query - A query to filter, page or sort relations.
   */
  queryRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: DTO,
    query: Query<Relation>,
  ): Promise<Relation[]>;

  queryRelations<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dtos: DTO[],
    query: Query<Relation>,
  ): Promise<Map<DTO, Relation[]>>;

  /**
   * 为 DTO 聚合关系.
   * @param RelationClass - The class to serialize the Relations into
   * @param dto - The DTO to query relations for.
   * @param relationName - The name of relation to query for.
   * @param filter - A filter to apply to relations.
   * @param aggregate - The aggregate query
   */
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

  /**
   * 计算关系数量
   * @param filter - Filter to create a where clause.
   */
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

  /**
   * 查找给定关系.
   * @param RelationClass - The class to serialize the Relation into
   * @param dto - The dto to find the relation on.
   * @param relationName - The name of the relation to query for.
   * @param opts - Additional options.
   */
  findRelation<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dto: DTO,
    opts?: FindRelationOptions<Relation>,
  ): Promise<Relation | undefined>;

  /**
   * Finds a single relation for each DTO passed in.
   *
   * @param RelationClass - The class to serialize the Relation into*
   * @param relationName - The name of the relation to query for.
   * @param dtos - The dto to find the relation on.
   * @param opts - Additional options.
   */
  findRelation<Relation>(
    context: IContext,
    RelationClass: Class<Relation>,
    relationName: string,
    dtos: DTO[],
    opts?: FindRelationOptions<Relation>,
  ): Promise<Map<DTO, Relation | undefined>>;

  /**
   * Adds multiple relations.
   * @param relationName - The name of the relation to query for.
   * @param id - The id of the dto to add the relation to.
   * @param relationIds - The ids of the relations to add.
   * @param opts - Additional options.
   */
  addRelations<Relation>(
    context: IContext,
    relationName: string,
    id: string | number | object,
    relationIds: (string | number | object)[],
    opts?: ModifyRelationOptions<DTO, Relation>,
  ): Promise<DTO>;

  /**
   * Set the relations on the dto.
   *
   * @param relationName - The name of the relation to query for.
   * @param id - The id of the dto to set the relation on.
   * @param relationIds - The ids of the relation to set on the dto. If the array is empty the relations will be
   * removed.
   * @param opts - Additional options.
   */
  setRelations<Relation>(
    context: IContext,
    relationName: string,
    id: string | number | object,
    relationIds: (string | number | object)[],
    opts?: ModifyRelationOptions<DTO, Relation>,
  ): Promise<DTO>;

  /**
   * Set the relation on the dto.
   *
   * @param relationName - The name of the relation to query for.
   * @param id - The id of the dto to set the relation on.
   * @param relationId - The id of the relation to set on the dto.
   * @param opts - Additional options.
   */
  setRelation<Relation>(
    context: IContext,
    relationName: string,
    id: string | number | object,
    relationId: string | number | object,
    opts?: ModifyRelationOptions<DTO, Relation>,
  ): Promise<DTO>;

  /**
   * Removes multiple relations.
   * @param relationName - The name of the relation to query for.
   * @param id - The id of the dto to add the relation to.
   * @param relationIds - The ids of the relations to add.
   * @param opts - Additional options.
   */
  removeRelations<Relation>(
    context: IContext,
    relationName: string,
    id: string | number | object,
    relationIds: (string | number | object)[],
    opts?: ModifyRelationOptions<DTO, Relation>,
  ): Promise<DTO>;

  /**
   * Remove the relation on the dto.
   *
   * @param relationName - The name of the relation to query for.
   * @param id - The id of the dto to set the relation on.
   * @param relationId - The id of the relation to set on the dto.
   * @param opts - Additional options.
   */
  removeRelation<Relation>(
    context: IContext,
    relationName: string,
    id: string | number,
    relationId: string | number,
    opts?: ModifyRelationOptions<DTO, Relation>,
  ): Promise<DTO>;

  /**
   * Gets a record by `id`.
   *
   * **NOTE** This method will return a rejected Promise if the record is not found.
   *
   * @param id - the id of the record.
   * @param opts - Additional options to apply when getting by id.
   * @returns the found record or a rejected promise.
   */
  getById(context: IContext, id: string | number, opts?: GetByIdOptions<DTO>): Promise<DTO>;

  /**
   * Create a single record.
   *
   * @param item - the record to create.
   * @returns the created record.
   */
  createOne(context: IContext, item: C): Promise<DTO>;

  /**
   * 创建多条记录.
   *
   * @param items - the records to create.
   * @returns a created records.
   */
  createMany(context: IContext, items: C[]): Promise<DTO[]>;

  /**
   * 更新一条记录.
   * @param id - 记录ID
   * @param update - 待更新内容.
   * @param opts - Additional opts to apply when updating one entity.
   * @returns 更新后的记录.
   */
  updateOne(context: IContext, id: string | number, update: U, opts?: UpdateOneOptions<DTO>): Promise<DTO>;

  /**
   * 根据筛选条件更新多条记录.
   * @param update - the update to apply.
   * @param filter - the filter used to specify records to update
   */
  updateMany(context: IContext, update: U, filter: Filter<DTO>): Promise<UpdateManyResponse>;

  /**
   * 根据 id 删除单条记录.
   * @param id - the id of the record to delete.
   * @param opts - Additional opts to apply when deleting by id.
   */
  deleteOne(context: IContext, id: number | string, opts?: DeleteOneOptions<DTO>): Promise<DTO>;

  /**
   * 根据筛选条件删除多条记录.
   *
   * @param filter - 筛选条件.
   */
  deleteMany(context: IContext, filter: Filter<DTO>): Promise<DeleteManyResponse>;
}

/**
 * QueryRepository decorator to register
 * @param DTOClass - the DTO class that the QueryRepository is used for.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare,@typescript-eslint/no-unused-vars -- intentional
export function QueryRepository<DTO, C = DeepPartial<DTO>, U = DeepPartial<DTO>>(DTOClass: Class<DTO>) {
  return <Cls extends Class<QueryRepository<DTO, C, U>>>(cls: Cls): Cls | void => Injectable()(cls);
}