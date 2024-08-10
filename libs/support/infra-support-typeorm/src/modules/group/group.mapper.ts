import { Injectable } from '@nestjs/common';
import { GroupEntity } from './group.entity';
import { plainToClass } from 'class-transformer';
import { GroupModel } from 'libs/api/infra-api/src';

@Injectable()
export class GroupMapper {
  toModel(entity?: GroupEntity): GroupModel | undefined {
    if (!entity) return undefined;

    const { parent, ...rest } = entity;
    return rest;
  }

  toEntity(model?: Partial<GroupModel>): GroupEntity | undefined {
    if (!model) return undefined;

    const { parent_id, ...rest } = model;
    const entity = plainToClass(GroupEntity, rest);

    if (parent_id) {
      entity.parent = { id: parent_id };
    }

    return entity;
  }
}
