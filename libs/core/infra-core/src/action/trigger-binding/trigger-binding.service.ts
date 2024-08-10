import { Injectable, Inject } from "@nestjs/common";
import { PageDto, PageQueryDto } from "libs/common/src/pagination/pagination.dto";
import { 
  ITriggerBindingRepository,
  ITriggerBindingService,
  TriggerBindingModel, 
  UpdateTriggerBindingModel,
} from "libs/api/infra-api/src";
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