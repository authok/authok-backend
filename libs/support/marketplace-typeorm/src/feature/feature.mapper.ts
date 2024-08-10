import { Mapper, ClassTransformerMapper } from '@libs/nest-core';
import { FeatureEntity } from './feature.entity';
import { FeactureDto } from 'libs/api/marketplace-api/src/feature/feature.dto';

@Mapper(FeactureDto, FeatureEntity)
export class FeatureMapper extends ClassTransformerMapper<FeactureDto, FeatureEntity> {
}