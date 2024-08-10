import { Mapper, ClassTransformerMapper } from '@libs/nest-core';
import { CategoryDto } from 'libs/api/marketplace-api/src/category/category.dto';
import { CategoryEntity } from './category.entity';

@Mapper(CategoryDto, CategoryEntity)
export class CategoryMapper extends ClassTransformerMapper<CategoryDto, CategoryEntity> {
}