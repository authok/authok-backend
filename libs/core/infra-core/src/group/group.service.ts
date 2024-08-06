import { IContext, IRequestContext } from "@libs/nest-core";
import { IGroupService } from "libs/api/infra-api/src/group/group.service";
import { Injectable, Inject } from "@nestjs/common";
import { IGroupRepository } from "libs/api/infra-api/src/group/group.repository";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { GroupModel } from "libs/api/infra-api/src/group/group.model";
import { PageQuery } from "libs/common/src/pagination/pagination.model";

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @Inject('IGroupRepository') private readonly groupRepository: IGroupRepository,
  ) {}

  async create(ctx: IContext, group: Partial<GroupModel>): Promise<GroupModel> {
    return await this.groupRepository.create(ctx, group);
  }

  async retrieve(ctx: IContext, id: string): Promise<GroupModel | undefined> {
    return await this.groupRepository.retrieve(ctx, id);
  }

  async update(ctx: IContext, group: Partial<GroupModel>): Promise<GroupModel> {
    return await this.groupRepository.update(ctx, group);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    await this.groupRepository.delete(ctx, id);
  }

  async paginate(ctx: IContext, query: PageQuery): Promise<PageDto<GroupModel>> {
    return await this.groupRepository.paginate(ctx, query);
  }

  async findByOuterId(ctx: IContext, type: string, outer_id: string): Promise<GroupModel | undefined> {
    return await this.groupRepository.findByOuterId(ctx, type, outer_id);
  }
}