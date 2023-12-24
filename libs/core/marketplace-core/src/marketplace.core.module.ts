import { Module, Global } from '@nestjs/common';
import { CatalogService } from './catalog/catalog.service';
import { CategoryService } from './category/category.service';
import { FeatureService } from './feature/feature.service';

@Global()
@Module({
  providers: [
    {
      provide: 'ICatalogService',
      useClass: CatalogService,
    },
    {
      provide: 'ICategoryService',
      useClass: CategoryService,
    },
    {
      provide: 'IFeatureService',
      useClass: FeatureService,  
    }
  ],
  exports: [
    'ICatalogService',
    'ICategoryService',
    'IFeatureService',
  ],
})
export class MarketplaceCoreModule {}
