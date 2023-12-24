import { Injectable } from '@nestjs/common';
import { IGroup } from 'libs/api/infra-api/src/group/group';
import { GroupEntity } from './group.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GroupMapper {
  toDTO(entity?: GroupEntity): IGroup | undefined {
    if (!entity) return undefined;

    const { parent, ...rest } = entity;
    return rest;
  }

  toEntity(model?: Partial<IGroup>): GroupEntity | undefined {
    if (!model) return undefined;

    const { parent_id, ...rest } = model;
    const entity = plainToClass(GroupEntity, rest);

    if (parent_id) {
      entity.parent = { id: parent_id };
    }

    return entity;
  }
}
