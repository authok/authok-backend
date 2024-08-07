import { Inject, Injectable } from '@nestjs/common';
import { Command, Option } from 'nestjs-command';
import { IFeatureService } from 'libs/api/marketplace-api/src/feature/feature.service';

@Injectable()
export class FeatureCommand {
  constructor(
    @Inject('IFeatureService')
    private readonly featureService: IFeatureService,
  ) {}

  @Command({
    command: 'create:feature',
    describe: '创建feature',
  })
  async create(
    @Option({
      name: 'slug',
      describe: 'slug',
      type: 'string',
      alias: 'slug',
      required: true
    })
    slug: string,
    @Option({
      name: 'name',
      describe: '名称',
      type: 'string',
      alias: 'name',
      required: true
    })
    name: string,
  ) {
    const saved = await this.featureService.createOne({}, {
      slug,
      name,
    } as any);

    console.log(`feature 创建成功:`, saved);
  }

  @Command({
    command: 'list:features',
    describe: '获取 feature 列表',
  })
  async listFeatures() {
    const page = await this.featureService.paginate({}, {});
    console.log(page);
  }
}