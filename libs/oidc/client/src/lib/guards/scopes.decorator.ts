import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to specify the scopes needed to access a route
 *
 * Created by: Long Hung Nguyen (longhungn)
 */
export const Scopes = (...scopes: string[]) => SetMetadata('scopes', scopes);
