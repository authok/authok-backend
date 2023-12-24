import { CatalogDto } from "./catalog.dto";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { IContext, QueryService } from "@libs/nest-core";

export interface ICatalogService extends QueryService<CatalogDto> {
  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<CatalogDto>>;

  findBySlug(ctx: IContext, slug: string): Promise<CatalogDto | undefined>;

  findByFeatureAndCatalog(ctx: IContext, feature_slug: string, catalog: string): Promise<CatalogDto | undefined>;
}