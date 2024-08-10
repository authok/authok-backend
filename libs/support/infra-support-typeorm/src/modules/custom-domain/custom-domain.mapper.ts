import { Mapper, ClassTransformerMapper } from '@libs/nest-core';
import { CustomDomainModel } from 'libs/api/infra-api/src';
import { CustomDomainEntity } from './custom-domain.entity';

@Mapper(CustomDomainModel, CustomDomainEntity)
export class CustomDomainMapper extends ClassTransformerMapper<CustomDomainModel, CustomDomainEntity> {
}