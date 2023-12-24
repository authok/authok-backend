import { DynamicModule, ForwardReference } from '@nestjs/common';
import { Mapper } from './mappers';
import { Class } from './common';
import { createRepositories } from './providers';

export interface NestCoreModuleOpts {
  global?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imports?: Array<Class<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mappers?: Class<Mapper<any, any, any, any, any, any>>[];
}

export class NestCoreModule {
  static forFeature(opts: NestCoreModuleOpts): DynamicModule {
    const { imports = [], mappers = [] } = opts;
    const mapperRepositoryProviders = createRepositories(mappers);
    console.log('mapperRepositoryProviders: ', mapperRepositoryProviders);
    return {
      global: opts.global,
      module: NestCoreModule,
      imports: [...imports],
      providers: [...mappers, ...mapperRepositoryProviders],
      exports: [...imports, ...mappers, ...mapperRepositoryProviders],
    };
  }
}