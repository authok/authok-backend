import { IContext } from "@libs/nest-core";
import { Injectable, Inject } from "@nestjs/common";
import { 
  IConfigService,
  IConfigRepository,
  ConfigModel,
} from "libs/api/infra-api/src";
import { PageQuery, Page } from "libs/common/src/pagination/pagination.model";

@Injectable()
export class ConfigService implements IConfigService {
  constructor(
    @Inject('IConfigRepository')
    private readonly configRepository: IConfigRepository,
  ) {}

  async get(ctx: IContext, namespace: string, name: string): Promise<ConfigModel | undefined> {
    return await this.configRepository.get(ctx, namespace, name);
  }

  async set(ctx: IContext, namespace: string, name: string, config: ConfigModel): Promise<ConfigModel> {
    return await this.configRepository.set(ctx, namespace, name, config);
  }

  async delete(ctx: IContext, namespace: string, name: string): Promise<void> {
    return await this.configRepository.delete(ctx, namespace, name);
  }

  async paginate(
    ctx: IContext,
    query: PageQuery,
  ): Promise<Page<ConfigModel>> {
    return await this.configRepository.paginate(ctx, query);
  }
}