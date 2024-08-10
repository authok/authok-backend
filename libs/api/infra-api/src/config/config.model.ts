

export interface ConfigModel {
  namespace?: string;
  name: string; 
  enabled: boolean;
  value: Record<string, any>;
  updated_at: Date;
  created_at: Date;
}