import { Controller, Get, Inject, Query, Param } from "@nestjs/common";
import { ReqCtx, IRequestContext } from "@libs/nest-core";
import { PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { ICategoryService } from "libs/api/marketplace-api/src/category/category.service";

@Controller('/api/v2/marketplace/categories')
export class CategoryController {
  constructor(
    @Inject('ICategoryService')
    private readonly categoryService: ICategoryService,
  ) {}

  @Get()
  async paginate(
    @ReqCtx() ctx: IRequestContext,
    @Query() query: PageQueryDto,
  ) {
    return await this.categoryService.paginate(ctx, query);
  }
}