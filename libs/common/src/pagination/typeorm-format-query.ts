import { SelectQueryBuilder } from 'typeorm';

export const applyPaginationQuery = <EntityType>(
  qb: SelectQueryBuilder<EntityType>,
  fields: Record<string, any>,
): SelectQueryBuilder<EntityType> => {
  for (const field in fields) {
    let op;
    let relation;
    let fieldName;
    const items = field.split('.');
    if (items.length == 1) {
      fieldName = `${qb.alias}.${field}`;
    } else if (items.length == 2) {
      const [_relation, field] = items;
      relation = _relation;
      fieldName = `${relation}.${field}`;
    }

    const val = fields[field];
    const params = {};

    params[fieldName] = val;

    let valueExp;

    if (Array.isArray(val)) {
      op = 'IN';
      valueExp = `(:...${fieldName})`;
    } else {
      op = '=';
      valueExp = `:${fieldName}`;
    }

    const sql = `${fieldName} ${op} ${valueExp}`;

    if (items.length == 1) {
      qb.andWhere(sql, params);
    } else if (items.length == 2) {
      qb.innerJoin(`${qb.alias}.${relation}`, relation).andWhere(sql, params);
    }
  }

  return qb;
};
