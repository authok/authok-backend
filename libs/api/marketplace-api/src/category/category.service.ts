import { IRequestContext, QueryRepository } from "@libs/nest-core";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { CategoryDto } from "./category.dto";

export interface ICategoryService extends QueryRepository<CategoryDto> {
  paginate(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<CategoryDto>>;
}