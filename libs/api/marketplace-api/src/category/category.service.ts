import { IContext } from "@libs/nest-core";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { CategoryDto } from "./category.dto";

export interface ICategoryService {
  createOne(ctx: IContext, data: CategoryDto): Promise<CategoryDto>;
  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<CategoryDto>>;
}