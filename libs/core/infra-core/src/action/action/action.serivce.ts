import { IRequestContext } from "@libs/nest-core";
import { PageQueryDto, PageDto } from "libs/common/src/pagination/pagination.dto";
import { IActionService } from 'libs/api/infra-api/src/action/action/action.service';
import { Injectable, Inject } from '@nestjs/common';
import { IActionRepository } from 'libs/api/infra-api/src/action/action/action.repository';
import { ActionDto } from "libs/api/infra-api/src/action/action/action.dto";

@Injectable()
export  class ActionService implements IActionService { 
  constructor(
    @Inject('IActionRepository')
    private readonly actionRepository: IActionRepository,
  ) {}
  
  async create(ctx: IRequestContext, action: ActionDto): Promise<ActionDto> {
    return await this.actionRepository.create(ctx, action);
  }

  async retrieve(ctx: IRequestContext, id: string): Promise<ActionDto | undefined> {
    return await this.actionRepository.retrieve(ctx, id);
  }

  async update(ctx: IRequestContext, action: Partial<ActionDto>): Promise<ActionDto> {
    return await this.actionRepository.update(ctx, action);
  }

  async delete(ctx: IRequestContext, id: string): Promise<void> {
    await this.actionRepository.delete(ctx, id);
  }

  async paginate(ctx: IRequestContext, query: PageQueryDto): Promise<PageDto<ActionDto>> {
    return await this.actionRepository.paginate(ctx, query);
  }
}