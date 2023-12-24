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
    const { page = 1, page_size = 10, sort, filter, ...rest } = query;

    const _query = { filter, 
      paging: {
        offset: (page-1) * page_size,
        limit: page_size,
      } 
    } as Query<CategoryDto>;

    const items = await this.repo.query(ctx, _query);
    const total = await this.repo.count(ctx, query.filter);

    return {
      items,
      meta: {
        total,
        page,
        page_size,
      }
    };
  }
}