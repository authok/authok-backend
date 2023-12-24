import { IRequestContext } from "@libs/nest-core";
import { IGroup } from "libs/api/infra-api/src/group/group";
import { IGroupService } from "libs/api/infra-api/src/group/group.service";
import { Injectable, Inject } from "@nestjs/common";
import { IGroupRepository } from "libs/api/infra-api/src/group/group.repository";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";

@Injectable()
export class GroupService implements IGroupService {
  constructor(
    @Inject('IGroupRepository') private readonly groupRepository: IGroupRepository,
  ) {}

  async create(ctx: IRequestContext, group: Partial<IGroup>): Promise<IGroup> {
    return await this.groupRepository.create(ctx, group);
  }

  async retrieve(ctx: IRequestContext, id: string): Promise<IGroup | undefined> {
    return await this.groupRepository.retrieve(ctx, id);
  }

  async update(ctx: IRequestContext, group: Partial<IGroup>): Promise<IGroup> {
    return await this.groupRepository.update(ctx, group);
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    await this.groupRepository.delete(ctx, id);
  }

  async paginate(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<IGroup>> {
    return await this.groupRepository.paginate(ctx, query);
  }

  async findByOuterId(ctx: IRequestContext, type: string, outer_id: string): Promise<IGroup | undefined> {
    return await this.groupRepository.findByOuterId(ctx, type, outer_id);
  }

}