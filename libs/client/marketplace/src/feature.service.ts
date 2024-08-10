import { IContext } from "@libs/nest-core";
import { FeactureDto } from "libs/api/marketplace-api/src/feature/feature.dto";
import { IFeatureService } from "libs/api/marketplace-api/src/feature/feature.service";
import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";


export class FeatureService implements IFeatureService {
  paginate(ctx: IContext, query: PageQuery): Promise<Page<FeactureDto>> {
    return null;
  }

  async createOne(ctx: IContext, data: FeactureDto): Promise<FeactureDto> {
    return null;
  }
}