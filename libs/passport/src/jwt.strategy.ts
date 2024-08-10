import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { IClientService } from 'libs/api/infra-api/src';
import createJwksClient from 'jwks-rsa';
import * as https from 'https';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('IClientService')
    private readonly clientService: IClientService,
  ) {
    super({
      algorithms: ['HS256', 'RS256'],
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          console.log('start secretOrKeyProvider', rawJwtToken);

          const { header, payload } = jwt.decode(rawJwtToken, {
            complete: true,
          }) as {
            [key: string]: any;
          };
          console.log('jwt decoded', header, payload);

          switch (header.alg) {
            case 'HS256': {
              const client = await this.clientService.retrieve(
                {},
                payload.client_id,
              );

              if (!client) {
                console.log('hahah');
                done(new NotFoundException('client not found'));
                return;
              }
              console.log('client: ', client.client_secret);
              done(null, client.client_secret);
              break;
            }
            case 'RS256': {
              // jwks
              const jwksUri = `${payload.iss}.well-known/jwks.json`;
              console.log('jwksUri', jwksUri);
              const jwksClient = createJwksClient({
                jwksUri,
                cache: true,
                cacheMaxEntries: 100,
                cacheMaxAge: 10 * 60 * 1000, // 缓存10分钟
                requestAgent: new https.Agent({
                  rejectUnauthorized: false,
                }),
              });

              jwksClient.getSigningKey(header.kid, function (err, key: any) {
                if (err) {
                  console.error('getSigningKey error', err);
                  return done(err);
                }

                const signingKey = key.publicKey || key.rsaPublicKey;
                console.log('signingKey', signingKey);
                done(null, signingKey);
              });
              break;
            }
            default:
              done(new NotFoundException(`alg: ${header.alg} not match`));
          }
        } catch (err) {
          console.log('err: ', err);
          done(err);
        }
      },
    });
    console.log('jwt策略构造');
  }

  async validate(payload: any) {
    console.log('validate', payload);

    return { ...payload };
  }
}
