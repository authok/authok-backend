const {
  interactionPolicy: { Prompt, Check, base },
} = require('@authok/oidc-provider');

import * as pushInlineSha from '@authok/oidc-provider/lib/helpers/script_src_sha';
import * as wildcard from 'wildcard';
import * as psl from 'psl';
import { Provider } from '@authok/oidc-provider';
import { Logger } from '@nestjs/common';
import Configuration from '@authok/oidc-provider/lib/helpers/configuration';

const { InvalidClientMetadata } = Provider.errors;

const isOrigin = (value) => {
  if (typeof value !== 'string') {
    return false;
  }
  try {
    const { origin } = new URL(value);
    // Origin: <scheme> "://" <hostname> [ ":" <port> ]
    return value === origin;
  } catch (err) {
    return false;
  }
};

export const DEFAULT_OIDC_CONFIGURATION: Configuration = {
  routes: {
    authorization: '/authorize',
    backchannel_authentication: '/backchannel',
    code_verification: '/device',
    device_authorization: '/oauth/device/auth',
    // end_session: '/session/end',
    end_session: '/v2/logout',
    introspection: '/token/introspection',
    jwks: '/.well-known/jwks.json',
    pushed_authorization_request: '/request',
    registration: '/oidc/register',
    revocation: '/oauth/token/revoke',
    token: '/oauth/token',
    userinfo: '/userinfo',
  },
  formats: {
    customizers: {},
  },
  clientDefaults: {
    grant_types: [
      'authorization_code',
      'implicit',
      'refresh_token',
      'client_credentials',
      'urn:ietf:params:oauth:grant-type:device_code',
      'password',
      'http://authok.io/oauth/grant-type/password-realm',
      'http://authok.io/oauth/grant-type/mfa-oob',
      'http://authok.io/oauth/grant-type/mfa-otp',
      'http://authok.io/oauth/grant-type/mfa-recovery-code',
    ],
    id_token_signed_response_alg: 'RS256',
    response_types: [
      'code id_token token',
      'code id_token',
      'code token',
      'code',
      'token',
      'id_token token',
      'id_token',
      'none',
    ],
    token_endpoint_auth_method: 'none',
  },
  extraParams: [
    'realm',
    'connection',
    'connection_scope',
    'login_ticket',
    'organization',
    'invitation',
    'organization_name',
    'protocol',
  ],
  extraClientMetadata: {
    properties: [
      'tenant',
      'redirect_uris',
      'is_first_party',
      'allowed_origins',
      'grants',
      'client_metadata',
    ],
    validator(ctx, key, value, metadata) {
      switch (key) {
        case 'tenant': {
          if (value === undefined) {
            metadata['tenant'] = undefined;
            return;
          }
          // TODO
          break;
        }
        case 'allowed_origins': {
          // set default (no CORS)
          if (value === undefined) {
            metadata['allowed_origins'] = [];
            return;
          }
          // validate an array of Origin strings
          if (!Array.isArray(value) || !value.every(isOrigin)) {
            throw new InvalidClientMetadata(
              `allowed_origins must be an array of origins`,
            );
          }
          break;
        }
        case 'redirect_uris': {
          for (const redirectUri of value) {
            if (redirectUri.includes('*')) {
              const { hostname, href } = new URL(redirectUri);

              if (href.split('*').length !== 2) {
                throw new InvalidClientMetadata(
                  'redirect_uris with a wildcard may only contain a single one',
                );
              }

              if (!hostname.includes('*')) {
                throw new InvalidClientMetadata(
                  'redirect_uris may only have a wildcard in the hostname',
                );
              }

              const test = hostname.replace('*', 'test');

              // checks that the wildcard is for a full subdomain e.g. *.panva.cz, not *suffix.panva.cz
              if (!wildcard(hostname, test)) {
                throw new InvalidClientMetadata(
                  'redirect_uris with a wildcard must only match the whole subdomain',
                );
              }

              if (!psl.get(hostname.split('*.')[1])) {
                throw new InvalidClientMetadata(
                  'redirect_uris with a wildcard must not match an eTLD+1 of a known public suffix domain',
                );
              }
            }
          }
          break;
        }
      }
    },
  },
  clientBasedCORS(ctx, origin, client) {
    // ctx.oidc.route can be used to exclude endpoints from this behaviour, in that case just return
    // true to always allow CORS on them, false to deny
    // you may also allow some known internal origins if you want to
    const r = client['allowed_origins'].includes(origin);
    Logger.debug(`跨域检查: 是否包含 ${origin}, ${r}`);
    return r;
  },
  clients: [
    /*
    {
      client_id: 'k5u3o2fiAA8XweXEEX604KCwCjzjtMU3',
      client_secret: 'bar',
      grant_types: [
        'authorization_code',
        'implicit',
        'refresh_token',
        'client_credentials',
        'password',
        'http://authok.io/oauth/grant-type/password-realm',
        'http://authok.io/oauth/grant-type/mfa-oob',
        'http://authok.io/oauth/grant-type/mfa-otp',
        'http://authok.io/oauth/grant-type/mfa-recovery-code',
        'urn:ietf:params:oauth:grant-type:device_code',
      ],
      response_types: ['code'],
      redirect_uris: ['http://localhost:3000/oauth/callback'],
      token_endpoint_auth_method: 'none',
      // + other client properties
    },
    */
  ],
  pkce: {
    required: () => false,
  },
  scopes: ['openid', 'profile', 'offline_access', 'email'],
  cookies: {
    keys: [
      'some secret key',
      'and also the old rotated away some time ago',
      'and one more',
    ],
    short: {
      maxAge: 86400,
    },
  },
  responseTypes: [
    'code id_token token',
    'code id_token',
    'code token',
    'code',
    'token',
    'id_token token',
    'id_token',
    'none',
  ],
  claims: {
    openid: [
      'sub',
      'name',
      'username',
      'email',
      'phone_number',
      'nickname',
      'picture',
      'gender',
      'org_id',
    ],
    amr: null,
    address: ['address'],
    email: ['email', 'email_verified'],
    phone: ['phone_number', 'phone_number_verified', 'phone_country_code'],
    profile: [
      'birthdate',
      'family_name',
      'gender',
      'username',
      'given_name',
      'locale',
      'middle_name',
      'name',
      'nickname',
      'picture',
      'website',
      'zoneinfo',
      'identities',
      'created_at',
      'org_id',
    ],
  },
  interactions: {},
  features: {
    clientCredentials: { enabled: true },
    devInteractions: { enabled: false }, // defaults to true
    deviceFlow: { enabled: true }, // defaults to false
    revocation: { enabled: true }, // defaults to false
    userinfo: { enabled: true },
    webMessageResponseMode: { enabled: true },
    rpInitiatedLogout: {
      logoutSource: (ctx, form) => {
        ctx.body = `<!DOCTYPE html>
    <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta charset="utf-8">
      <title>退出登录</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <script>${pushInlineSha(
        ctx,
        `false && document.addEventListener('DOMContentLoaded', function () { document.forms[0]['logout'].click() });`,
      )}</script>
      <style type="text/css">
        .ant-btn {
          line-height: 1.5715;
          position: relative;
          display: inline-block;
          font-weight: 400;
          white-space: nowrap;
          text-align: center;
          background-image: none;
          border: 1px solid transparent;
          box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          touch-action: manipulation;
          height: 32px;
          padding: 4px 15px;
          font-size: 14px;
          border-radius: 2px;
          color: rgba(0, 0, 0, 0.85);
          border-color: #d9d9d9;
          background: #fff;
        }

        .ant-btn-primary {
          color: #fff;
          border-color: #1890ff;
          background: #1890ff;
          text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
          box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
        }

        .ant-btn-lg {
          height: 40px;
          padding: 6.4px 15px;
          font-size: 16px;
          border-radius: 2px;
        }

        .ant-btn, .ant-btn:active, .ant-btn:focus {
          outline: 0;
        }

        .container {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h3>确定要退出登录? ${ctx.host}</h3>
        ${form}
        <button class="ant-btn ant-btn-lg" autofocus type="submit" form="op.logoutForm" value="yes" name="logout">退出登录</button>
        <button class="ant-btn ant-btn-primary ant-btn-lg" type="submit" form="op.logoutForm">不要退出</button>
      </div>
    </body>
    </html>`;
      },
    },
  },
};
