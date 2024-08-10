import { Inject, Injectable } from "@nestjs/common";
import { ICatalogService } from "libs/api/marketplace-api/src/catalog/catalog.service";
import { CatalogDto } from "libs/api/marketplace-api/src/catalog/catalog.dto";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { IContext, Query, QueryRepository, ProxyQueryService, AggregateResponse } from "@libs/nest-core";
import { FeactureDto } from "libs/api/marketplace-api/src/feature/feature.dto";
import * as _ from 'lodash';
import { CategoryDto } from "libs/api/marketplace-api/src/category/category.dto";

@Injectable()
export class CatalogService extends ProxyQueryService<CatalogDto> implements ICatalogService {
  constructor(
    @Inject('CatalogMapperQueryRepository') private readonly repo: QueryRepository<CatalogDto>,
    @Inject('CategoryMapperQueryRepository') private readonly categoryRepo: QueryRepository<CategoryDto>,
    @Inject('FeatureMapperQueryRepository') private readonly featureRepo: QueryRepository<FeactureDto>,  
  ) {
    super(repo);
  }

  async findBySlug(ctx: IContext, slug: string): Promise<CatalogDto | undefined> {
    const catalog = await this.repo.queryOne(ctx, {
      and: [
        {
          slug: {
            eq: slug,
          }
        }
      ]
    });
    if (!catalog) return undefined;

    const feature = await this.repo.findRelation(ctx, FeactureDto, 'feature', catalog);
    catalog.feature = _.omit(feature, 'id', 'updated_at', 'created_at');
    return catalog;
  }

  async paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<CatalogDto>> {
    const { page = 1, per_page = 10, sort, filter } = query;

    const _query = { 
      filter,
      paging: {
        offset: (page-1) * per_page,
        limit: per_page,
      } 
    } as Query<CatalogDto>;

    const items = await this.repo.query(ctx, _query);
    const total = await this.repo.count(ctx, query.filter);



    
    const _categories = await this.categoryRepo.query(ctx, {
      paging: {
        limit: 100,
      }
    });

    const categories = _categories.map(it => {
      return { category: it, count: 0 };
    });

    const _filter = {...query.filter};
    _filter.and  = _filter.and?.filter(it => !it['feature']);

    const featuresAgg = await this.repo.aggregate(ctx, _filter, {
      count: ['id'],
      groupBy: ['feature_id']
    });

    let features = [];
    if (featuresAgg.length > 0) {
      const _features = await this.featureRepo.query(ctx, {
        filter: {
          and: [
            {
              id: {
                in: featuresAgg.map(it => it.groupBy.feature_id),
              }
            }
          ]
        } as any
      });

      features = _features.map(it => {
        const featureGroup = featuresAgg.find((i: AggregateResponse<CatalogDto>) => i.groupBy.feature_id === it.id)
        return { feature: it, count: featureGroup.count.id };
      });
    }

    return {
      items,
      meta: {
        categories,
        features,
        total,
        page,
        per_page,
      }
    };
  }

  async findByFeatureAndCatalog(ctx: IContext, feature_slug: string, catalog_id: string): Promise<CatalogDto | undefined> {
    const catalog = await this.repo.queryOne(ctx, {
      and: [
        {
          feature: {
            slug: {
              eq: feature_slug,
            }
          },
        },
        {
          catalog_id: {
            eq: catalog_id,
          }
        }
      ]
    } as any);
    if (!catalog) return undefined;

    const feature = await this.repo.findRelation(ctx, FeactureDto, 'feature', catalog);
    catalog.feature = _.omit(feature, 'id', 'updated_at', 'created_at');
    return catalog;
  }
}