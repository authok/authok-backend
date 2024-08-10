import { Inject, Injectable } from "@nestjs/common";
import { QueryRepository, Query, IContext, ProxyQueryService } from "@libs/nest-core";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { IFeatureService } from "libs/api/marketplace-api/src/feature/feature.service";
import { FeactureDto } from "libs/api/marketplace-api/src/feature/feature.dto";

@Injectable()
export class FeatureService extends ProxyQueryService<FeactureDto> implements IFeatureService {
  constructor(
    @Inject('FeatureMapperQueryRepository') private readonly repo: QueryRepository<FeactureDto>,
  ) {
    super(repo);
  }

  async paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<FeactureDto>> {
    const { page = 1, per_page = 10, sort, filter } = query;

    const _query = { 
      filter, 
      paging: {
        offset: (page-1) * per_page,
        limit: Math.max(per_page, 100),
      } 
    } as Query<FeactureDto>;

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