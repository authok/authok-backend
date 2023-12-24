import { Mapper, ClassTransformerMapper } from '@libs/nest-core';
import { PasswordResetDto } from 'libs/api/infra-api/src/password-reset/password-reset.dto';
import { PasswordResetEntity } from './password-reset.entity';

@Mapper(PasswordResetDto, PasswordResetEntity)
export class PasswordResetMapper extends ClassTransformerMapper<PasswordResetDto, PasswordResetEntity> {
  convertToDTO(entity: PasswordResetEntity): PasswordResetDto {
    const dto = super.convertToDTO(entity);
    return dto;
  }
}