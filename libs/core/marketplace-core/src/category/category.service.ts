import { Inject, Injectable } from "@nestjs/common";
import { QueryRepository, Query, IContext, ProxyQueryService } from "@libs/nest-core";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { CategoryDto } from "libs/api/marketplace-api/src/category/category.dto";
import { ICategoryService } from "libs/api/marketplace-api/src/category/category.service";

@Injectable()
export class CategoryService extends ProxyQueryService<CategoryDto> implements ICategoryService {
  constructor(
    @Inject('CategoryMapperQueryRepository') private readonly repo: QueryRepository<CategoryDto>,
  ) {
    super(repo);
  }

  async paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<CategoryDto>> {
    const { page = 1, per_page = 10, sort, filter, ...rest } = query;

    const _query = { filter, 
      paging: {
        offset: (page-1) * per_page,
        limit: per_page,
      } 
    } as Query<CategoryDto>;

    const items = await this.repo.query(ctx, _query);
    const total = await this.repo.count(ctx, query.filter);

    return {
      items,
      meta: {
        total,
        page,
        per_page,
      }
    };
  }
}