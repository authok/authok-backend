import { Controller, Get, Inject, Query, Param } from "@nestjs/common";
import { ReqCtx, IRequestContext } from "@libs/nest-core";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { IFeatureService } from "libs/api/marketplace-api/src/feature/feature.service";
import { CatalogPageQueryDto, CatalogDto } from "libs/api/marketplace-api/src/catalog/catalog.dto";
import { ICatalogService } from "libs/api/marketplace-api/src/catalog/catalog.service";

@Controller('/api/v2/marketplace/features')
export class FeatureController {
  constructor(
    @Inject('IFeatureService')
    private readonly featureService: IFeatureService,
    @Inject('ICatalogService')
    private readonly catalogService: ICatalogService,
  ) {}

  @Get()
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: PageQueryDto,
  ) {
    return await this.featureService.paginate(ctx, query);
  }

   // 这里应该重构为 feature + catalog_id 来代表 unique key 进行查找
   @Get(':feature_slug/:catalog_id')
   async findByFeatureAndCatalog(
     @ReqCtx() ctx: IRequestContext,
     @Param('feature_slug') feature_slug: string,
     @Param('catalog_id') catalog_id: string,
   ) {
     return await this.catalogService.findByFeatureAndCatalog(ctx, feature_slug, catalog_id);
   }
   @Get(':feature_slug')
   async paginateCatalogs(
     @ReqCtx() ctx: IRequestContext,
     @Param('feature_slug') feature_slug: string,
     @Query() query: CatalogPageQueryDto,
   ): Promise<PageDto<CatalogDto>> {
     query.filter = {
       and: []
     }
 
     if (!!feature_slug && feature_slug !== '') {
       query.filter.and.push({
         feature: {
           slug: {
             eq: feature_slug
           },
         },
       });
     }
 
     if (query.catalog_id) {
       if (Array.isArray(query.catalog_id)) {
         query.filter.and.push({
           catalog_id: {
             in: query.catalog_id,
           }
         });
       } else {
         query.filter.and.push({
           catalog_id: {
             eq: query.catalog_id,
           }
         });
       }
     }
 
     return await this.catalogService.paginate(ctx, query);
   }
}