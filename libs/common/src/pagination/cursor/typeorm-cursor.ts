import { Repository, ObjectLiteral, SelectQueryBuilder, OrderByCondition, Brackets, WhereExpression } from "typeorm";
import { paginate as _paginate } from 'nestjs-typeorm-paginate';
import { CursorResult, CursorQueryDto, Order } from "./cursor.dto";
import * as msgpack from 'msgpack5';
import { applyPaginationQuery } from "../typeorm-format-query";
import * as moment from 'moment';

type Cursor = Record<string, any>;

export async function cursor<Entity extends ObjectLiteral>(
  repo: Repository<Entity>, 
  query: CursorQueryDto,
  paginationKeys: Extract<keyof Entity, string>[],
  allowedFields: Extract<keyof Entity, string>[],
) {
  const fields = {};
  for (let fieldName of allowedFields) {
    const v = query[fieldName as string];
    if (v) {
      fields[fieldName as string] = v;
    }
  }

  const qb = repo.createQueryBuilder();

  applyPaginationQuery(qb, fields);

  const paginator = new CursorPaginator<Entity>(query, paginationKeys);
  return await paginator.paginate(qb);
}

class CursorPaginator<Entity> {
  private order: Order = 'DESC';
  private nextAfterCursor: string | null = null;
  private nextBeforeCursor: string | null = null;

  constructor(
    private readonly query: CursorQueryDto,
    private readonly paginationKeys: Extract<keyof Entity, string>[],
  ) {}

  private hasAfterCursor(): boolean {
    return !!this.query.after;
  }

  private hasBeforeCursor(): boolean {
    return !!this.query.before;
  }

  public async paginate(builder: SelectQueryBuilder<Entity>): Promise<CursorResult<Entity>> {
    const limit = this.query.first || 100;
    
    const entities = await this.appendPagingQuery(builder).getMany();
    const hasMore = entities.length > limit;

    console.log('limit: ', hasMore, entities.length, limit);

    if (hasMore) {
      entities.splice(entities.length - 1, 1);
    }

    if (entities.length === 0) {
      return this.toPagingResult(entities);
    }

    if (!this.hasAfterCursor() && this.hasBeforeCursor()) {
      console.log('reverse before');
      entities.reverse();
    }

    if (this.hasBeforeCursor() || hasMore) {
      this.nextAfterCursor = this.encode(entities[entities.length - 1]);
    }

    if (this.hasAfterCursor() || (hasMore && this.hasBeforeCursor())) {
      this.nextBeforeCursor = this.encode(entities[0]);
    }

    return this.toPagingResult(entities);
  }

  private toPagingResult(entities: Entity[]): CursorResult<Entity> {
    return {
      data: entities?.map((it) => ({ cursor: this.encode(it), node: it })) || [],
      endCursor: this.nextAfterCursor,
      startCursor: this.nextBeforeCursor,
      hasNextPage: !!this.nextAfterCursor,
      hasPreviousPage: !!this.nextBeforeCursor,
    };
  }

  private appendPagingQuery(builder: SelectQueryBuilder<Entity>): SelectQueryBuilder<Entity> {
    const limit = this.query.first || 100;

    const cursors: Cursor = {};
  
    if (this.hasAfterCursor()) {
      Object.assign(cursors, this.decode(this.query.after as string));
    } else if (this.hasBeforeCursor()) {
      Object.assign(cursors, this.decode(this.query.before as string));
    }
  
    if (Object.keys(cursors).length > 0) {
      builder.andWhere(new Brackets((where) => this.buildCursorQuery(builder.alias, where, cursors)));
    }
  
    builder.take(limit + 1)
      .orderBy(this.buildOrder(builder.alias));
  
    return builder;
  }

  private buildCursorQuery(alias: string, where: WhereExpression, cursor: Cursor): void {
    const operator = this.getOperator();

    const params: Cursor = [];
    let query = '';
    this.paginationKeys.forEach((key) => {
      params[key] = cursor[key];
      where.orWhere(`${query}${alias}.${key} ${operator} :${key}`, params);
      query = `${query}${alias}.${key} = :${key} AND `;
    });
  }

  private getOperator(): string {
    if (this.hasAfterCursor()) {
      return this.query.order === 'ASC' ? '>' : '<';
    }

    if (this.hasBeforeCursor()) {
      return this.query.order === 'ASC' ? '<' : '>';
    }

    return '=';
  }

  private buildOrder(alias: string): OrderByCondition {
    let { order } = this.query;
    order = order || 'DESC';

    if (!this.hasAfterCursor() && this.hasBeforeCursor()) {
      order = this.flipOrder(order);
    }
  
    const orderByCondition: OrderByCondition = {};
    this.paginationKeys.forEach((key) => {
      orderByCondition[`${alias}.${key}`] = order;
    });
    return orderByCondition;
  }

  private flipOrder(order: Order): Order {
    return order === 'ASC'
      ? 'DESC'
      : 'ASC';
  }

  private decode(cursorStr: string): Cursor {
    const buf = Buffer.from(cursorStr , 'base64');
    const cursor =  msgpack().decode(buf);
    console.log('after decode: ', cursor.date, cursor.date.getTime());
    return cursor;
  }
  
  private encode(entity: Entity): string {
    const payload: Cursor = {};
    for (const key of this.paginationKeys) {
      payload[key] = entity[key];
    }
    
    const buf = msgpack().encode(payload);
    return Buffer.from(buf).toString('base64');
  }
}