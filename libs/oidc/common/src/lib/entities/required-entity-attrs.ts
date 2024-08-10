import { KindOfId } from './interface';

export interface IRequiredEntityAttrs {
  id: KindOfId;
  grantId?: string;
  userCode?: string;
  uid?: string;
  data: string;
  expiresAt: Date;
  consumedAt: Date;
}
