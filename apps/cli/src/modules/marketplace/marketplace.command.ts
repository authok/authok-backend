import { Inject, Injectable } from '@nestjs/common';
import { Command, Option } from 'nestjs-command';
import { CatalogDto } from 'libs/api/marketplace-api/src/catalog/catalog.dto';
import { CategoryDto } from 'libs/api/marketplace-api/src/category/category.dto';
import { ICatalogService } from 'libs/api/marketplace-api/src/catalog/catalog.service';
import { ICategoryService } from 'libs/api/marketplace-api/src/category/category.service';

@Injectable()
export class MarketplaceCommand {
  constructor(
    @Inject('ICatalogService')
    private readonly catalogService: ICatalogService,
    @Inject('ICategoryService')
    private readonly categoryService: ICategoryService,
  ) {}

  @Command({
    command: 'create:catalog',
    describe: '创建应用条目',
  })
  async create(
    @Option({
      name: 'catalog_id',
      describe: 'catalog_id',
      type: 'string',
      alias: 'catalog_id',
      required: true
    })
    catalog_id: string,
    @Option({
      name: 'name',
      describe: '名称',
      type: 'string',
      alias: 'name',
      required: true
    })
    name: string,
    @Option({
      name: 'categories',
      description: '分类',
      type: 'array',
      alias: 'categories',
    })
    categories: string[],
  ) {
    console.log('categories: ', categories)

    const saved = await this.catalogService.createOne({}, {
      catalog_id,
      name,
      metaTitle: name,
      metaDescription: name,
      slug: catalog_id,
      categories,
    } as CatalogDto);

    console.log(`catalog 创建成功: ${saved.id}`);
  }

  @Command({
    command: 'create:category',
    describe: '创建分类',
  })
  async createCategory(
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
    const saved = await this.categoryService.createOne({}, {
      slug,
      name,
    } as CategoryDto);

    console.log(`分类创建成功: ${saved.id}`);
  }

  @Command({
    command: 'list:catalogs',
    describe: '浏览应用条目',
  })
  async list(
    @Option({
      name: 'category',
      describe: '类目slug',
      type: 'string',
      alias: 'category',
      required: true
    })
    category: string,
  ) {
    const query = { 
      filter: {
        categories: {
          slug: {
            eq: category,
          }
        }
      }
    };

    const page = await this.catalogService.paginate({}, query);
    console.log(page);
  }
}