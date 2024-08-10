import { Mapper, ClassTransformerMapper } from '@libs/nest-core';
import { PasswordResetEntity } from './password-reset.entity';
import { PasswordResetModel } from 'libs/api/infra-api/src';

@Mapper(PasswordResetModel, PasswordResetEntity)
export class PasswordResetMapper extends ClassTransformerMapper<PasswordResetModel, PasswordResetEntity> {
  convertToDTO(entity: PasswordResetEntity): PasswordResetModel {
    const dto = super.convertToDTO(entity);
    return dto;
  }
}