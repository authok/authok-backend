import Configuration from '@authok/oidc-provider/lib/helpers/configuration';
import { DEFAULT_OIDC_CONFIGURATION } from './default.configuration';
import { Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { IContext } from '@libs/nest-core';
import { IExtension } from '../extention';

export interface IConfiguration {
  set(path: string, value: any, defaultValue?: any);
}

class ConfigurationHolder implements IConfiguration {
  value: Configuration;
  constructor(value: Configuration) {
    this.value = value;
  }

  set(path: string, value: any, defaultValue?: any) {
    const v = value || defaultValue;
    if (v) {
      _.set(this.value, path, v);
    }
  }
}

export class OIDCConfigurationBuilder {
  private _extentions: IExtension<IConfiguration>[] = [];
  private configurationHolder: ConfigurationHolder;
  
  constructor() {
    this.configurationHolder = new ConfigurationHolder({...(DEFAULT_OIDC_CONFIGURATION as any) });
  }

  extend(...extentions: IExtension<IConfiguration>[]): OIDCConfigurationBuilder {
    this._extentions.push(...extentions);
    return this;
  }

  set(path: string, value: any, defaultValue?: any): OIDCConfigurationBuilder {
    this.configurationHolder.set(path, value, defaultValue);

    return this;
  }

  build(ctx: IContext): Configuration {
    for (const extention of this._extentions) {
      Logger.log(`OIDCConfiguration extend >> ${extention.constructor.name}`);
      extention.extend(ctx, this.configurationHolder);
    }

    return this.configurationHolder.value;
  }
}