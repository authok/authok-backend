import { IContext } from "@libs/nest-core";
import { FeactureDto } from "./feature.dto";
import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";

export interface IFeatureService {
  createOne(ctx: IContext, data: FeactureDto): Promise<FeactureDto>

  paginate(ctx: IContext, query: PageQuery): Promise<Page<FeactureDto>>;
}