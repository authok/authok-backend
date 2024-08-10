import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { IClientService } from 'libs/api/infra-api/src';
import { IModelAdapter } from './model.adapter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientAdaptor implements IModelAdapter {
  constructor(
    @Inject('IClientService')
    private readonly clientService: IClientService,
    private readonly configService: ConfigService,
  ) {
    console.warn('ClientAdaptor.ctor()');
  }

  async upsert(ctx: Record<string, any>, id: string, payload) {
    const data = {
      ...(payload.application_type
        ? { app_type: payload.application_type }
        : undefined),
      ...(payload.grant_types
        ? { grant_types: payload.grant_types }
        : undefined),
      ...(payload.id_token_signed_response_alg
        ? { id_token_signed_response_alg: payload.id_token_signed_response_alg }
        : undefined),
      ...(payload.post_logout_redirect_uris
        ? { allowed_logout_urls: payload.post_logout_redirect_uris }
        : undefined),
      ...(payload.require_auth_time
        ? { require_auth_time: payload.require_auth_time }
        : undefined),
      ...(payload.response_types
        ? { response_types: payload.response_types }
        : undefined),
      ...(payload.subject_type
        ? { subject_type: payload.subject_type }
        : undefined),
      ...(payload.token_endpoint_auth_method
        ? { token_endpoint_auth_method: payload.token_endpoint_auth_method }
        : undefined),
      ...(payload.revocation_endpoint_auth_method
        ? {
            revocation_endpoint_auth_method:
              payload.revocation_endpoint_auth_method,
          }
        : undefined),
      ...(payload.require_signed_request_object
        ? {
            require_signed_request_object:
              payload.require_signed_request_object,
          }
        : undefined),
      ...(payload.request_uris
        ? { request_uris: payload.request_uris }
        : undefined),
      ...(payload.client_secret
        ? { client_secret: payload.client_secret }
        : undefined),
      ...(payload.redirect_uris
        ? { redirect_uris: payload.redirect_uris }
        : undefined),
      ...(payload.client_metadata
        ? { client_metadata: payload.client_metadata }
        : undefined),
      ...(payload.tenant ? { tenant: payload.tenant } : undefined),
      ...(payload.is_first_party && { is_first_party: payload.is_first_party }),
      ...(payload.allowed_origins && {
        allowed_origins: payload.allowed_origins,
      }),
    };

    const existClient = await this.clientService.retrieve(
      ctx.req.customRequestContext,
      id,
    );
    if (existClient) {
      return await this.clientService.update({}, existClient.client_id, data);
    }
    return await this.clientService.create({}, data);
  }

  async find(ctx: Record<string, any>, id: string) {
    const client = await this.clientService.retrieve(
      ctx.req.customRequestContext,
      id,
    );

    const redirect_uris = client.redirect_uris || [];
    const whitelist = this.configService.get('redirect_uris');
    if (whitelist) {
      redirect_uris.push(...whitelist);
    }

    return {
      client_id: client.client_id,
      client_secret: client.client_secret,
      ...(client.app_type ? { application_type: client.app_type } : undefined),
      ...(client.grant_types ? { grant_types: client.grant_types } : undefined),
      ...(client.id_token_signed_response_alg
        ? { id_token_signed_response_alg: client.id_token_signed_response_alg }
        : undefined),
      ...(client.require_auth_time
        ? { require_auth_time: client.require_auth_time }
        : undefined),
      ...(client.response_types
        ? { response_types: client.response_types }
        : undefined),
      ...(client.subject_type
        ? { subject_type: client.subject_type }
        : undefined),
      ...(client.token_endpoint_auth_method
        ? { token_endpoint_auth_method: client.token_endpoint_auth_method }
        : undefined),
      ...(client.revocation_endpoint_auth_method
        ? {
            revocation_endpoint_auth_method:
              client.revocation_endpoint_auth_method,
          }
        : undefined),
      ...(client.require_signed_request_object
        ? {
            require_signed_request_object: client.require_signed_request_object,
          }
        : undefined),
      ...(client.client_secret
        ? { client_secret: client.client_secret }
        : undefined),
      ...(client.tenant ? { tenant: client.tenant } : undefined),
      ...(client.is_first_party && { is_first_party: client.is_first_party }),
      ...(client.grants && { grants: client.grants }),
      ...(client.client_metadata && {
        client_metadata: client.client_metadata,
      }),
      request_uris: client.request_uris || [],
      redirect_uris,
      post_logout_redirect_uris: client.allowed_logout_urls || [],
      ...(client.allowed_origins && {
        allowed_origins: client.allowed_origins,
      }),
    };
  }

  async destroy(ctx: Record<string, any>, id: string) {
    await this.clientService.delete(ctx.req.customRequestContext, id);
  }

  async findByUserCode(ctx: Record<string, any>, userCode: string) {
    throw new NotImplementedException('not need for client model');
  }

  async findByUid(ctx: Record<string, any>, uid: string) {
    throw new NotImplementedException('not need for client model');
  }

  async consume(ctx: Record<string, any>, id: string) {
    throw new NotImplementedException('not need for client model');
  }

  async revokeByGrantId(ctx: Record<string, any>, grantId: string) {
    throw new NotImplementedException('not need for client model');
  }
}
