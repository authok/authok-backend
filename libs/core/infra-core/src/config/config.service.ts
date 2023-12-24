import { IRequestContext } from "@libs/nest-core";
import { Injectable, Inject } from "@nestjs/common";
import { IConfigService } from "libs/api/infra-api/src/config/config.service";
import { IConfigRepository } from "libs/api/infra-api/src/config/config.repository";
import { Config } from "libs/api/infra-api/src/config/config.model";
import { PageQuery, Page } from "libs/common/src/pagination/pagination.model";

@Injectable()
export class ConfigService implements IConfigService {
  constructor(
    @Inject('IConfigRepository')
    private readonly configRepository: IConfigRepository,
  ) {}

  async get(ctx: IRequestContext, namespace: string, name: string): Promise<Config | undefined> {
    return await this.configRepository.get(ctx, namespace, name);
  }

  async set(ctx: IRequestContext, namespace: string, name: string, config: Config): Promise<Config> {
    return await this.configRepository.set(ctx, namespace, name, config);
  }

  async delete(ctx: IRequestContext, namespace: string, name: string): Promise<void> {
    return await this.configRepository.delete(ctx, namespace, name);
  }

  async paginate(
    ctx: IRequestContext,
    query: PageQuery,
  ): Promise<Page<Config>> {
    return await this.configRepository.paginate(ctx, query);
  }
}