/**
 * MFA(多因素认证)的因素
 */
export class FactorModel {
  id: string;
  factorType: string;
  provider: string;
  name: string;
  status: string;
  profile?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}
