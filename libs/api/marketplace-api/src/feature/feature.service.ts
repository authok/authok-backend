import { QueryService, IContext } from "@libs/nest-core";
import { FeactureDto } from "./feature.dto";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";

export interface IFeatureService extends QueryService<FeactureDto> {
  paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<FeactureDto>>;
}