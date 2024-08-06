import { Injectable, Inject } from "@nestjs/common";
import { TriggerBindingModel, UpdateTriggerBindingModel } from "libs/api/infra-api/src/action/trigger-binding/trigger-binding.model";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { ITriggerBindingRepository } from "libs/api/infra-api/src/action/trigger-binding/trigger-binding.repository";
import { ITriggerBindingService } from "libs/api/infra-api/src/action/trigger-binding/trigger-binding.service";
import { IContext } from "@libs/nest-core";

@Injectable()
export class TriggerBindingService implements ITriggerBindingService { 
  constructor(
    @Inject('ITriggerBindingRepository')
    private readonly triggerBindingRepository: ITriggerBindingRepository,
  ) {}
  async update(ctx: IContext, trigger_id: string, bindings: UpdateTriggerBindingModel[]): Promise<TriggerBindingModel[]> {
    return await this.triggerBindingRepository.update(ctx, trigger_id, bindings);
  }

  async paginate(ctx: IContext, query: PageQueryDto): Promise<PageDto<TriggerBindingModel>> {
    return await this.triggerBindingRepository.paginate(ctx, query);
  }
}