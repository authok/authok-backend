import { IContext } from "@libs/nest-core";
import { CatalogDto } from "libs/api/marketplace-api/src/catalog/catalog.dto";
import { ICatalogService } from "libs/api/marketplace-api/src/catalog/catalog.service";
import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";


export class CatalogService implements ICatalogService {
  async createOne(ctx: IContext, data: CatalogDto): Promise<CatalogDto> {
    return null;
  }
  
  async paginate(ctx: IContext, query: PageQuery): Promise<Page<CatalogDto>> {
    return null;
  }

  async findBySlug(ctx: IContext, slug: string): Promise<CatalogDto | undefined> {
    return null;
  }

  async findByFeatureAndCatalog(ctx: IContext, feature_slug: string, catalog: string): Promise<CatalogDto | undefined> {
    return null;
  }
}