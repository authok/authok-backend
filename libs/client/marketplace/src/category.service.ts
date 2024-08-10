import { IContext } from "@libs/nest-core";
import { CategoryDto } from "libs/api/marketplace-api/src/category/category.dto";
import { ICategoryService } from "libs/api/marketplace-api/src/category/category.service";
import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";



export class CategoryService implements ICategoryService {
  createOne(ctx: IContext, data: CategoryDto): Promise<CategoryDto> {
    return null;
  }

  paginate(ctx: IContext, query: PageQuery): Promise<Page<CategoryDto>> {
    return null;
  }
}