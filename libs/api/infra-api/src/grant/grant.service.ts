import { IRequestContext } from "@libs/nest-core";
import { GrantDto } from "./grant.dto";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";

export interface IGrantService {
  retrieve(ctx: IRequestContext, id: string): Promise<GrantDto | undefined>;

  update(ctx: IRequestContext, grant: Partial<GrantDto>): Promise<GrantDto>;

  create(ctx: IRequestContext, grant: Partial<GrantDto>): Promise<GrantDto>;

  delete(ctx: IRequestContext, id: string): Promise<void>;

  deleteByUserId(ctx: IRequestContext, user_id: string): Promise<void>;

  paginate(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<GrantDto>>;
}