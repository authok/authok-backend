import { ISAMLPService } from '../interface';
import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import * as samlify from 'samlify';
import { LRUCache } from 'lru-cache';
import { ConfigService } from '@nestjs/config';
import { IKeyService, ITenantService, IClientService } from 'libs/api/infra-api/src';
import * as consolidate from 'consolidate';
import metadataTemplate from './metadata.template';
import { IContext } from '@libs/nest-core';

@Injectable()
export class SAMLPService implements ISAMLPService {
  private cache: LRUCache<string, samlify.IdentityProviderInstance>;

  constructor(
    private readonly configService: ConfigService,
    @Inject('ITenantService')
    private tenantService: ITenantService,
    @Inject('IKeyService')
    private keyService: IKeyService,
    @Inject('IClientService')
    private clientService: IClientService,
  ) {
    const cacheOptions: LRUCache.Options<any, any, any> = {
      max: this.configService.get('provider.cache.max') || 500,
      ttl: this.configService.get('provider.cache.maxAge') || 1000 * 86400,
    };
    this.cache = new LRUCache(cacheOptions);
  }
   
  async findIdp(ctx: IContext, client_id: string): Promise<samlify.IdentityProviderInstance> {
    console.log('tenantName: ', ctx.tenant);
  
    const key = `${ctx.tenant}:${client_id}`;

    // 1. 直接查找 cache
    let idp = this.cache.get(key);
    if (false && idp) {
      Logger.debug(`在缓存中命中 samlp provider, tenant: ${ctx.tenant}, client: ${client_id}`);
      return idp;
    }

    const signingKey = await this.keyService.findActiveKey(ctx);
    if (!signingKey) throw new NotFoundException(`Active key for ${ctx.tenant} not found`);

    console.log('signingKey.cert: ', samlify.Utility.normalizeCerString(signingKey.cert));

    const client = await this.clientService.retrieve(ctx, client_id);
    if (!client) {
      throw new NotFoundException(`client ${client_id} not found`);
    }

    const samlp = client.addons?.samlp;
    if (!samlp) {
      throw new NotFoundException(`addons samlp for client ${client_id} not found`);
    }

    const metadata = await consolidate.liquid.render(metadataTemplate, {
      issuer: ctx.req.hostname,
      client_id,
      cert: samlify.Utility.normalizeCerString(signingKey.cert),
    });

    idp = samlify.IdentityProvider({
      privateKey: signingKey.pkcs8,
      // isAssertionEncrypted: true,
      // encPrivateKey: signingKey.pkcs8,
      // encryptCert: signingKey.cert,
      loginResponseTemplate: Object.assign(
        Object.create(null),
        samlify.SamlLib.defaultLoginResponseTemplate, {
          attributes: samlp.attributes.map((attr, i) => ({
            name: attr.name,
            // nameFormat: attr.name,
            valueTag: `${i}`,
            // value: attr.value,
            valueXsiType: 'xs:string',
          }))
        }
      ),
      /*
      loginResponseTemplate: {
        context:
          '<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="{ID}" Version="2.0" IssueInstant="{IssueInstant}" Destination="{Destination}" InResponseTo="{InResponseTo}"><saml:Issuer>{Issuer}</saml:Issuer><samlp:Status><samlp:StatusCode Value="{StatusCode}"/></samlp:Status><saml:Assertion ID="{AssertionID}" Version="2.0" IssueInstant="{IssueInstant}" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"><saml:Issuer>{Issuer}</saml:Issuer><saml:Subject><saml:NameID Format="{NameIDFormat}">{NameID}</saml:NameID><saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml:SubjectConfirmationData NotOnOrAfter="{SubjectConfirmationDataNotOnOrAfter}" Recipient="{SubjectRecipient}" InResponseTo="{InResponseTo}"/></saml:SubjectConfirmation></saml:Subject><saml:Conditions NotBefore="{ConditionsNotBefore}" NotOnOrAfter="{ConditionsNotOnOrAfter}"><saml:AudienceRestriction><saml:Audience>{Audience}</saml:Audience></saml:AudienceRestriction></saml:Conditions>{AttributeStatement}</saml:Assertion></samlp:Response>',
        attributes: samlp.attributes.map((attr, i) => ({
          name: attr.name,
          // nameFormat: attr.name,
          valueTag: `${i}`,
          valueXsiType: 'xs:string',
        }))
      },
      */
      // metadata, // 配置了metadata之后，下面的属性就都不用配置了
      signingCert: signingKey.cert,
      entityID: `urn:${ctx.req.hostname}`,
      singleSignOnService: [
        {
          Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
          Location: `https://${ctx.req.hostname}/samlp/${client_id}`,
        },
        {
          Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
          Location: `https://${ctx.req.hostname}/samlp/${client_id}`,
        }
      ],
      singleLogoutService: [
        {
          Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
          Location: `https://${ctx.req.hostname}}/samlp/${client_id}/logout`,
        },
        {
          Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
          Location: `https://${ctx.req.hostname}}/samlp/${client_id}/logout`,
        }   
      ],
      nameIDFormat: [
        'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
        'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
      ],
    });

    this.cache.set(key, idp);

    return idp;
  }

  async findSp(ctx: IContext, client_id: string): Promise<samlify.ServiceProviderInstance> {
    const client = await this.clientService.retrieve(ctx, client_id);
    if (!client) {
      throw new NotFoundException(`client ${client_id} not found`);
    }

    const samlp = client.addons?.samlp;
    if (!samlp) {
      throw new NotFoundException(`client addon samlp not found`);  
    }

    const signingKey = await this.keyService.findActiveKey(ctx);
    if (!signingKey) throw new NotFoundException(`Active key for ${ctx.tenant} not found`);

    const sp = samlify.ServiceProvider({
      entityID: samlp.audience,
      authnRequestsSigned: false,
      wantAssertionsSigned: true,
      wantMessageSigned: true,
      wantLogoutResponseSigned: true,
      wantLogoutRequestSigned: true,
      privateKey: signingKey.pkcs8,
      encPrivateKey: signingKey.pkcs8,
      assertionConsumerService: [
        {
          Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
          Location: samlp.consumer,
        },
      ],
    });

    return sp;
  }
}