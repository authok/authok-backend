import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

export const SIMPLE_JSON = (defaultValue: any) => {
  return <ValueTransformer>{
    to(value: any): any {
      return JSON.stringify(value || defaultValue);
    },
    from(value: any): any {
      return JSON.parse(value);
    },
  };
};
