import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { Provider as OidcProvider } from '@authok/oidc-provider';
import * as jose from 'jose';
import { LRUCache } from 'lru-cache';
import { ConfigService } from '@nestjs/config';
import { ITenantService, IKeyService } from 'libs/api/infra-api/src';
import * as _ from 'lodash';
import { OIDCConfigurationBuilder, IConfiguration } from '../provider/configuration/configuration.builder';
import { OIDCProviderBuilder } from '../provider/provider.builder';
import { IExtension } from '../provider/extention';


@Injectable()
export class OidcService {
  private cache: LRUCache<string, OidcProvider>;

  constructor(
    private readonly configService: ConfigService,
    @Inject('ITenantService')
    private tenantService: ITenantService,
    @Inject('IKeyService')
    private keyService: IKeyService,
    @Inject('OIDCProviderExtensions')
    private readonly extensions: IExtension<OidcProvider>[],
    @Inject('OIDCConfigurationExtensions')
    private readonly configurationExtensions: IExtension<IConfiguration>[],
  ) {
    const cacheOptions: LRUCache.Options<any, any, any> = {
      max: this.configService.get('provider.cache.max') || 500,
      ttl: this.configService.get('provider.cache.maxAge') || 1000 * 86400,
    };
    this.cache = new LRUCache(cacheOptions);
  }

  async findProvider(issuer: string) {
    const url = new URL(issuer);
    const segments = url.hostname.split('.');      
    const tenantName = segments[0];
    const region = segments[1];
    console.log('tenantName: ', region, tenantName);

    // 1. 直接查找 cache
    let provider = this.cache.get(issuer);
    if (provider) {
      Logger.debug('在缓存中命中 provider, issuer', issuer);
      return provider;
    }

    // 2. 从服务中加载
    Logger.log('创建新的 provider, issuer: ', issuer);
    const tenantSettings = await this.tenantService.findByName({}, tenantName);
    if (!tenantSettings) throw new NotFoundException(`Tenant ${tenantName} ${region} not found`);
    const signingKey = await this.keyService.findActiveKey({
      tenant: tenantSettings.id,
    });
    if (!signingKey) throw new NotFoundException(`Active key for ${tenantSettings.id} ${region} ${tenantName} not found`);

    const pubKey = await jose.importSPKI(signingKey.spki, tenantSettings.jwt_configuration.alg);
    // const pubKey = await jose.importPKCS8(signingKey.pkcs8, tenantSettings.jwt_configuration.alg);
    const jwks = await jose.exportJWK(pubKey);
    console.log('jwks: ', jwks);

    const ctx = { tenant: tenantSettings.id };

    const configuration = new OIDCConfigurationBuilder()
      .set('jwks', jwks)
      .set('cookies.short.maxAge', tenantSettings.jwt_configuration.lifetime_in_seconds * 1000, 2592000000 * 1000)
      .extend(...this.configurationExtensions)
      .build(ctx);
  
    provider = new OIDCProviderBuilder()
      .issuer(issuer)
      .configuration(configuration)
      .proxy(true)
      .extend(...this.extensions)
      .build(ctx);

    this.cache.set(issuer, provider);

    return provider;
  }
}
