import { OAuth2IdentityProvider } from '../../oauth2.identity.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubIdentityProvider extends OAuth2IdentityProvider {}
