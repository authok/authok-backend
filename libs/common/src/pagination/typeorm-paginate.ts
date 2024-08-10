import { PageQuery, PageMeta } from './pagination.model';
import {
  Repository,
  ObjectLiteral,
} from 'typeorm';
import {
  IPaginationMeta,
  paginate as _paginate,
} from 'nestjs-typeorm-paginate';
import { applyPaginationQuery } from './typeorm-format-query';

export async function paginate<Entity extends ObjectLiteral>(
  repository: Repository<Entity>,
  query: PageQuery,
  allowedFields?: string[],
) {
  const {
    per_page,
    page,
    sort,
    q,
    fields,
    include_fields,
    include_totals,
    ...rest
  } = query;

  const options = {
    limit: Math.min(Math.max(query.per_page ?? 20, 1), 100),
    page: query.page || 1,
    metaTransformer: (meta: IPaginationMeta): PageMeta => ({
      total: meta.totalItems,
      page: meta.currentPage,
      per_page: meta.itemsPerPage,
    }),
  };

  const queryFields = {};
  for (const [fieldName, value] of Object.entries(rest)) {
    // if (allowedFields.includes(fieldName)) {
    queryFields[fieldName] = value;
    // }
  }

  if (query.tenant) {
    queryFields['tenant'] = query.tenant;
  }

  // 选择查询的字段
  let select: (keyof Entity)[];
  if (fields) {
    select = [];
    const fieldsArr = fields.split(',');
    for (const fieldName of fieldsArr) {
      if (allowedFields && allowedFields.includes(fieldName)) {
        select.push(fieldName);
      }
    }
  }

  let qb = repository.createQueryBuilder();
  if (select && select.length > 0) {
    qb = qb.select(select as string[])
  }

  {
    applyPaginationQuery(qb, queryFields);

    if (query.sort) {
      let order_by;
      order_by = {};
      const items = query.sort.split(' ');
      for (const item of items) {
        if (item.startsWith('-')) {
          order_by[item.substring(1)] = 'DESC';
        } else {
          order_by[item] = 'ASC';
        }
      }

      const _order_by = {};
      for (const k in order_by) {
        _order_by[`${qb.alias}.${k}`] = order_by[k];
      }
      qb.orderBy(_order_by);
    }
  }

  return await _paginate<Entity, PageMeta>(qb, options);
}
