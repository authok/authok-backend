import { CatalogDto } from "./catalog.dto";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { IContext } from "@libs/nest-core";

export interface ICatalogService {
  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<CatalogDto>>;

  createOne(ctx: IContext, data: CatalogDto): Promise<CatalogDto>;

  findBySlug(ctx: IContext, slug: string): Promise<CatalogDto | undefined>;

  findByFeatureAndCatalog(ctx: IContext, feature_slug: string, catalog: string): Promise<CatalogDto | undefined>;
}