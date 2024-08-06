import { IContext } from "@libs/nest-core";
import { IActionService } from 'libs/api/infra-api/src/action/action/action.service';
import { Injectable, Inject } from '@nestjs/common';
import { IActionRepository } from 'libs/api/infra-api/src/action/action/action.repository';
import { ActionModel } from "libs/api/infra-api/src/action/action/action.model";
import { Page, PageQuery } from "libs/common/src/pagination/pagination.model";

@Injectable()
export  class ActionService implements IActionService { 
  constructor(
    @Inject('IActionRepository')
    private readonly actionRepository: IActionRepository,
  ) {}
  
  async create(ctx: IContext, action: ActionModel): Promise<ActionModel> {
    return await this.actionRepository.create(ctx, action);
  }

  async retrieve(ctx: IContext, id: string): Promise<ActionModel | undefined> {
    return await this.actionRepository.retrieve(ctx, id);
  }

  async update(ctx: IContext, action: Partial<ActionModel>): Promise<ActionModel> {
    return await this.actionRepository.update(ctx, action);
  }

  async delete(ctx: IContext, id: string): Promise<void> {
    await this.actionRepository.delete(ctx, id);
  }

  async paginate(ctx: IContext, query: PageQuery): Promise<Page<ActionModel>> {
    return await this.actionRepository.paginate(ctx, query);
  }
}