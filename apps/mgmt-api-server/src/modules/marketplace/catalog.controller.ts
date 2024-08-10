import { Controller, Get, Inject, Query, Param, Req } from "@nestjs/common";
import { ICatalogService } from "libs/api/marketplace-api/src/catalog/catalog.service";
import { ReqCtx, IRequestContext } from "@libs/nest-core";
import { CatalogDto, CatalogPageQueryDto } from "libs/api/marketplace-api/src/catalog/catalog.dto";
import { PageDto } from "libs/common/src/pagination/pagination.dto";

@Controller('/api/v2/marketplace/catalogs')
export class CatalogController {
  constructor(
    @Inject('ICatalogService')
    private readonly catalogService: ICatalogService,
  ) {}

  @Get('by-slug/:slug')
  async findBySlug(
    @ReqCtx() ctx: IRequestContext,
    @Param('slug') slug: string,
  ): Promise<CatalogDto | undefined> {
    return await this.catalogService.findBySlug(ctx, slug);
  }

  @Get()
  async paginate(    
    @ReqCtx() ctx: IRequestContext,
    @Query() query: CatalogPageQueryDto,
  ): Promise<PageDto<CatalogDto>> {
    query.filter = {
      and: []
    }

    if (!!query.category && query.category !== '') {
      if (Array.isArray(query.category)) {
        query.filter.and.push({
          categories: {
            slug: {
              in: query.category,
            }
          }
        });
      } else {
        query.filter.and.push({
          categories: {
            slug: {
              eq: query.category,
            }
          }
        });
      }
    }

    if (!!query.feature && query.feature !== '') {
      if (Array.isArray(query.feature)) {
        query.filter.and.push({
          feature: {
            slug: {
              in: query.feature,
            }
          }
        });
      } else {
        query.filter.and.push({
          feature: {
            slug: {
              eq: query.feature,
            }
          }
        });
      }
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