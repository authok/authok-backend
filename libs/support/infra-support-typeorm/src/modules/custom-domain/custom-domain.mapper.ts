import { Mapper, ClassTransformerMapper } from '@libs/nest-core';
import { CustomDomainDto } from 'libs/api/infra-api/src/custom-domain/custom-domain.dto';
import { CustomDomainEntity } from './custom-domain.entity';

@Mapper(CustomDomainDto, CustomDomainEntity)
export class CustomDomainMapper extends ClassTransformerMapper<CustomDomainDto, CustomDomainEntity> {
}