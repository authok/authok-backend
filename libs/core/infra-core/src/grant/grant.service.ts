import { IContext } from "@libs/nest-core";
import { PageDto, PageQueryDto } from "libs/common/src/pagination";
import { 
  IGrantService,
  IGrantRepository,
  GrantModel,
} from "libs/api/infra-api/src";
import { Inject } from "@nestjs/common";

export class GrantService implements IGrantService {
  constructor(
    @Inject('IGrantRepository')
    private readonly grantRepository: IGrantRepository,
  ) {}

  async retrieve(ctx: IContext, id: string): Promise<GrantModel | undefined> {
    return await this.grantRepository.retrieve(ctx, id);
  }

  async update(ctx: IContext, grant: Partial<GrantModel>): Promise<GrantModel> {
    return await this.grantRepository.update(ctx, grant);
  }

  async create(ctx: IContext, grant: Partial<GrantModel>): Promise<GrantModel> {
    return await this.grantRepository.create(ctx, grant);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    return await this.grantRepository.delete(ctx, id);
  }

  async paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<GrantModel>> {
    return await this.grantRepository.paginate(ctx, query);
  }

  async deleteByUserId(ctx: IContext, user_id: string): Promise<void> {
    await this.grantRepository.deleteByUserId(ctx, user_id);
  }

}