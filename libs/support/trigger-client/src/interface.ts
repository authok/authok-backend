
export interface ITriggerClient {
  run<T>(trigger: string, func: string, event: any): Promise<T>;
}