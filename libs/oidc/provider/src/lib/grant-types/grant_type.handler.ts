import { Provider } from '@authok/oidc-provider';

export interface IGrantTypeHandler {
  handler(provider: Provider);

  name: string;

  params: string[];

  dupes: string[];
}
