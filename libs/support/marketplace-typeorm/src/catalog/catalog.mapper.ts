import { Mapper, ClassTransformerMapper } from '@libs/nest-core';
import { CatalogDto } from 'libs/api/marketplace-api/src/catalog/catalog.dto';
import { CatalogEntity } from './catalog.entity';
import { CategoryEntity } from '../category/category.entity';
import { FeatureEntity } from '../feature/feature.entity';
import { FeactureDto } from 'libs/api/marketplace-api/src/feature/feature.dto';
import * as _ from 'lodash';

@Mapper(CatalogDto, CatalogEntity)
export class CatalogMapper extends ClassTransformerMapper<CatalogDto, CatalogEntity> {
  convertToDTO(entity: CatalogEntity): CatalogDto {
    const { categories, feature_id, feature, ...rest } = entity;
    const dto = this.convert(this.DTOClass, this.toPlain(rest as CatalogEntity));
  
    if (categories) {
      dto.categories = categories.map(it => it.id);
    }

    if (feature) {
      dto.feature = _.omit(feature, 'id', 'created_at', 'updated_at') as FeactureDto;
    }

    return dto;
  }

  convertToEntity(dto: CatalogDto): CatalogEntity {
    const { feature, categories, ...rest } = dto;
    const entity = this.convert(this.EntityClass, this.toPlain(rest as CatalogDto));
    
    if (categories) {
      entity.categories = categories.map(it => ({
        id: it,
      }) as CategoryEntity)
    }

    if (feature) {
      entity.feature = feature as FeatureEntity;
    }

    return entity;
  }
}