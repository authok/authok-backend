import { IRequestContext } from "@libs/nest-core";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { IGrantService } from "libs/api/infra-api/src/grant/grant.service";
import { Inject } from "@nestjs/common";
import { GrantDto } from "libs/api/infra-api/src/grant/grant.dto";
import { IGrantRepository } from "libs/api/infra-api/src/grant/grant.repository";

export class GrantService implements IGrantService {
  constructor(
    @Inject('IGrantRepository')
    private readonly grantRepository: IGrantRepository,
  ) {}

  async retrieve(ctx: IRequestContext, id: string): Promise<GrantDto | undefined> {
    return await this.grantRepository.retrieve(ctx, id);
  }

  async update(ctx: IRequestContext, grant: Partial<GrantDto>): Promise<GrantDto> {
    return await this.grantRepository.update(ctx, grant);
  }

  async create(ctx: IRequestContext, grant: Partial<GrantDto>): Promise<GrantDto> {
    return await this.grantRepository.create(ctx, grant);
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    return await this.grantRepository.delete(ctx, id);
  }

  async paginate(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<GrantDto>> {
    return await this.grantRepository.paginate(ctx, query);
  }

  async deleteByUserId(ctx: IRequestContext, user_id: string): Promise<void> {
    await this.grantRepository.deleteByUserId(ctx, user_id);
  }

}